"use client";

import type React from "react";

import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import type { Matrix, UpdateMatrixRequest } from "../types";

const MatrixEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMatrixById, updateMatrix } = useApi();
  const [matrix, setMatrix] = useState<Matrix | null>(null);
  const [formData, setFormData] = useState<UpdateMatrixRequest>({
    maxX: 10,
    maxY: 10,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewGrid, setPreviewGrid] = useState<boolean[][]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchMatrix = async () => {
      try {
        const data = await getMatrixById(Number(id));
        setMatrix(data);
        setFormData({
          maxX: data.maxX,
          maxY: data.maxY,
        });

        // Initialize preview grid
        const initialGrid = Array(data.maxY)
          .fill(null)
          .map(() => Array(data.maxX).fill(false));

        // Mark cells with drones
        data.drones.forEach((drone) => {
          if (drone.x < data.maxX && drone.y < data.maxY) {
            initialGrid[data.maxY - drone.y - 1][drone.x] = true;
          }
        });

        setPreviewGrid(initialGrid);
      } catch (error) {
        toast.error("Failed to fetch matrix details");
        navigate("/matrix-management");
      } finally {
        setLoading(false);
      }
    };

    fetchMatrix();
  }, [id, getMatrixById, navigate]);

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

    // Check if any drones would be outside the new dimensions
    if (matrix) {
      const outOfBoundsDrones = matrix.drones.filter(
        (drone) => drone.x >= formData.maxX || drone.y >= formData.maxY
      );

      if (outOfBoundsDrones.length > 0) {
        newErrors.dimensions = `${outOfBoundsDrones.length} drone(s) would be outside the new matrix dimensions. Please adjust dimensions or relocate drones first.`;
      }
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

    // Update preview grid when dimensions change
    if (
      name === "maxX" &&
      !isNaN(numValue) &&
      numValue > 0 &&
      numValue <= 100
    ) {
      setPreviewGrid((prev) =>
        prev.map((row) => {
          if (numValue > row.length) {
            return [...row, ...Array(numValue - row.length).fill(false)];
          } else {
            return row.slice(0, numValue);
          }
        })
      );
    } else if (
      name === "maxY" &&
      !isNaN(numValue) &&
      numValue > 0 &&
      numValue <= 100
    ) {
      if (numValue > previewGrid.length) {
        const newRows = Array(numValue - previewGrid.length)
          .fill(null)
          .map(() => Array(formData.maxX).fill(false));
        setPreviewGrid([...previewGrid, ...newRows]);
      } else {
        setPreviewGrid(previewGrid.slice(0, numValue));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !matrix) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateMatrix(matrix.id, formData);
      toast.success("Matrix updated successfully");
      navigate(`/matrices/${matrix.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update matrix"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCell = (rowIndex: number, colIndex: number) => {
    setPreviewGrid((prev) => {
      const newGrid = [...prev];
      newGrid[rowIndex] = [...newGrid[rowIndex]];
      newGrid[rowIndex][colIndex] = !newGrid[rowIndex][colIndex];
      return newGrid;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!matrix) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500 mb-4">Matrix not found.</p>
        <button
          onClick={() => navigate("/matrix-management")}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Matrix Management
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate("/matrix-management")}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Matrix {matrix.id}
        </h1>
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

          {errors.dimensions && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errors.dimensions}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                Matrix Preview
              </h3>
              <span className="text-xs text-gray-500">
                {matrix.drones.length} drone
                {matrix.drones.length !== 1 ? "s" : ""} in matrix
              </span>
            </div>
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
                Blue cells indicate positions with drones.
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
              {isSubmitting ? "Updating..." : "Update Matrix"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Drones in this Matrix
        </h2>
        {matrix.drones.length === 0 ? (
          <p className="text-gray-500">No drones in this matrix.</p>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Position
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Orientation
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {matrix.drones.map((drone) => (
                  <tr key={drone.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {drone.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      ({drone.x}, {drone.y})
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {drone.orientation}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                      <a
                        href={`/drones/${drone.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </a>
                      <a
                        href={`/drones/${drone.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatrixEdit;
