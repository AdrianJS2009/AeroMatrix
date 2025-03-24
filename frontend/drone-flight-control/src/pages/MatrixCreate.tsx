"use client";

import type React from "react";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import type { CreateMatrixRequest } from "../types";

const MatrixCreate = () => {
  const navigate = useNavigate();
  const { createMatrix } = useApi();
  const [formData, setFormData] = useState<CreateMatrixRequest>({
    maxX: 10,
    maxY: 10,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewGrid, setPreviewGrid] = useState<boolean[][]>(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill(false))
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.maxX < 1) {
      newErrors.maxX = "Width must be at least 1";
    } else if (formData.maxX > 100) {
      newErrors.maxX = "Width cannot exceed 100";
    }

    if (formData.maxY < 1) {
      newErrors.maxY = "Height must be at least 1";
    } else if (formData.maxY > 100) {
      newErrors.maxY = "Height cannot exceed 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = Number.parseInt(value, 10);

    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(numValue) ? 0 : numValue,
    }));

    if (
      name === "maxX" &&
      !isNaN(numValue) &&
      numValue > 0 &&
      numValue <= 100
    ) {
      setPreviewGrid((prevGrid) =>
        prevGrid.map((row) =>
          Array(numValue)
            .fill(false)
            .concat(row.slice(numValue))
            .slice(0, numValue)
        )
      );
    } else if (
      name === "maxY" &&
      !isNaN(numValue) &&
      numValue > 0 &&
      numValue <= 100
    ) {
      const newGrid = Array(numValue)
        .fill(null)
        .map((_, i) =>
          i < previewGrid.length
            ? previewGrid[i].slice(0, formData.maxX)
            : Array(formData.maxX).fill(false)
        );
      setPreviewGrid(newGrid);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createMatrix(formData);
      toast.success("Matrix created successfully");
      navigate(`/matrices/${result.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create matrix"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCell = (rowIndex: number, colIndex: number) => {
    setPreviewGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[rowIndex] = [...newGrid[rowIndex]];
      newGrid[rowIndex][colIndex] = !newGrid[rowIndex][colIndex];
      return newGrid;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate("/matrix-management")}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Matrix</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="maxX"
                className="block text-sm font-medium text-gray-700"
              >
                Width (X dimension)
              </label>
              <input
                type="number"
                id="maxX"
                name="maxX"
                min="1"
                max="100"
                value={formData.maxX}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.maxX ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.maxX && (
                <p className="mt-1 text-sm text-red-600">{errors.maxX}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="maxY"
                className="block text-sm font-medium text-gray-700"
              >
                Height (Y dimension)
              </label>
              <input
                type="number"
                id="maxY"
                name="maxY"
                min="1"
                max="100"
                value={formData.maxY}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.maxY ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.maxY && (
                <p className="mt-1 text-sm text-red-600">{errors.maxY}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Matrix Preview
            </h3>
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50 overflow-auto max-h-80">
              <div className="inline-block">
                {previewGrid
                  .slice(0, Math.min(formData.maxY, 20))
                  .map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                      {row
                        .slice(0, Math.min(formData.maxX, 20))
                        .map((cell, colIndex) => (
                          <div
                            key={colIndex}
                            className={`w-6 h-6 border border-gray-300 m-0.5 cursor-pointer ${
                              cell ? "bg-blue-500" : "bg-white"
                            }`}
                            onClick={() => toggleCell(rowIndex, colIndex)}
                            title={`Position (${colIndex}, ${
                              formData.maxY - rowIndex - 1
                            })`}
                          />
                        ))}
                    </div>
                  ))}
              </div>
              {(formData.maxX > 20 || formData.maxY > 20) && (
                <p className="text-xs text-gray-500 mt-2">
                  Preview limited to 20x20. Full matrix will be {formData.maxX}x
                  {formData.maxY}.
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Click on cells to toggle them (for visualization only).
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/matrix-management")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Matrix"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MatrixCreate;
