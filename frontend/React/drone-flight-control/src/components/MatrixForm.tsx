"use client";

import type React from "react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import type {
  CreateMatrixRequest,
  Matrix,
  UpdateMatrixRequest,
} from "../types";

interface MatrixFormProps {
  matrix?: Matrix;
  onSubmit?: (matrix: Matrix) => void;
}

const MatrixForm = ({ matrix, onSubmit }: MatrixFormProps) => {
  const navigate = useNavigate();
  const { createMatrix, updateMatrix } = useApi();
  const [formData, setFormData] = useState<
    CreateMatrixRequest | UpdateMatrixRequest
  >({
    maxX: 10,
    maxY: 10,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (matrix) {
      setFormData({
        maxX: matrix.maxX,
        maxY: matrix.maxY,
      });
    }
  }, [matrix]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.maxX === undefined || formData.maxX < 1) {
      newErrors.maxX = "Max X must be a positive number";
    }

    if (formData.maxY === undefined || formData.maxY < 1) {
      newErrors.maxY = "Max Y must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let result;

      if (matrix) {
        result = await updateMatrix(matrix.id, formData);
        toast.success("Matrix updated successfully");
      } else {
        result = await createMatrix(formData as CreateMatrixRequest);
        toast.success("Matrix created successfully");
      }

      if (onSubmit) {
        onSubmit(result);
      } else {
        navigate(`/matrices/${result.id}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="maxX"
            className="block text-sm font-medium text-gray-700"
          >
            Max X
          </label>
          <input
            type="number"
            id="maxX"
            name="maxX"
            min="1"
            value={formData.maxX}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.maxX ? "border-red-500" : ""
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
            Max Y
          </label>
          <input
            type="number"
            id="maxY"
            name="maxY"
            min="1"
            value={formData.maxY}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.maxY ? "border-red-500" : ""
            }`}
          />
          {errors.maxY && (
            <p className="mt-1 text-sm text-red-600">{errors.maxY}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {matrix ? "Update" : "Create"} Matrix
        </button>
      </div>
    </form>
  );
};

export default MatrixForm;
