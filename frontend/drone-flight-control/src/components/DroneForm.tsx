"use client";

import type React from "react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import type {
  CreateDroneRequest,
  Drone,
  Matrix,
  UpdateDroneRequest,
} from "../types";

interface DroneFormProps {
  drone?: Drone;
  onSubmit?: (drone: Drone) => void;
}

const DroneForm = ({ drone, onSubmit }: DroneFormProps) => {
  const navigate = useNavigate();
  const { createDrone, updateDrone, getAllMatrices } = useApi();
  const [matrices, setMatrices] = useState<Matrix[]>([]);
  const [formData, setFormData] = useState<
    CreateDroneRequest | UpdateDroneRequest
  >({
    name: "",
    model: "",
    x: 0,
    y: 0,
    orientation: "NORTH",
    matrixId: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchMatrices = async () => {
      try {
        const data = await getAllMatrices();
        setMatrices(data);

        // Set default matrixId if no drone is provided and matrices exist
        if (!drone && data.length > 0 && !formData.matrixId) {
          setFormData((prev) => ({ ...prev, matrixId: data[0].id }));
        }
      } catch (error) {
        toast.error("Failed to fetch matrices");
      }
    };

    fetchMatrices();
  }, [getAllMatrices, drone, formData.matrixId]);

  useEffect(() => {
    if (drone) {
      setFormData({
        name: drone.name,
        model: drone.model,
        x: drone.x,
        y: drone.y,
        orientation: drone.orientation,
        matrixId: drone.matrixId,
      });
    }
  }, [drone]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.model?.trim()) {
      newErrors.model = "Model is required";
    }

    if (formData.matrixId === 0) {
      newErrors.matrixId = "Matrix is required";
    }

    if (formData.x === undefined || formData.x < 0) {
      newErrors.x = "X position must be a non-negative number";
    }

    if (formData.y === undefined || formData.y < 0) {
      newErrors.y = "Y position must be a non-negative number";
    }

    if (!formData.orientation) {
      newErrors.orientation = "Orientation is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: ["x", "y", "matrixId"].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let result;

      if (drone) {
        result = await updateDrone(drone.id, formData);
        toast.success("Drone updated successfully");
      } else {
        result = await createDrone(formData as CreateDroneRequest);
        toast.success("Drone created successfully");
      }

      if (onSubmit) {
        onSubmit(result);
      } else {
        navigate(`/drones/${result.id}`);
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
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="model"
            className="block text-sm font-medium text-gray-700"
          >
            Model
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model || ""}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.model ? "border-red-500" : ""
            }`}
          />
          {errors.model && (
            <p className="mt-1 text-sm text-red-600">{errors.model}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="matrixId"
            className="block text-sm font-medium text-gray-700"
          >
            Matrix
          </label>
          <select
            id="matrixId"
            name="matrixId"
            value={formData.matrixId || ""}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.matrixId ? "border-red-500" : ""
            }`}
          >
            <option value="">Select a matrix</option>
            {matrices.map((matrix) => (
              <option key={matrix.id} value={matrix.id}>
                Matrix {matrix.id} ({matrix.maxX}x{matrix.maxY})
              </option>
            ))}
          </select>
          {errors.matrixId && (
            <p className="mt-1 text-sm text-red-600">{errors.matrixId}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="orientation"
            className="block text-sm font-medium text-gray-700"
          >
            Orientation
          </label>
          <select
            id="orientation"
            name="orientation"
            value={formData.orientation || ""}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.orientation ? "border-red-500" : ""
            }`}
          >
            <option value="NORTH">North</option>
            <option value="EAST">East</option>
            <option value="SOUTH">South</option>
            <option value="WEST">West</option>
          </select>
          {errors.orientation && (
            <p className="mt-1 text-sm text-red-600">{errors.orientation}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="x"
            className="block text-sm font-medium text-gray-700"
          >
            X Position
          </label>
          <input
            type="number"
            id="x"
            name="x"
            min="0"
            value={formData.x || 0}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.x ? "border-red-500" : ""
            }`}
          />
          {errors.x && <p className="mt-1 text-sm text-red-600">{errors.x}</p>}
        </div>

        <div>
          <label
            htmlFor="y"
            className="block text-sm font-medium text-gray-700"
          >
            Y Position
          </label>
          <input
            type="number"
            id="y"
            name="y"
            min="0"
            value={formData.y || 0}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.y ? "border-red-500" : ""
            }`}
          />
          {errors.y && <p className="mt-1 text-sm text-red-600">{errors.y}</p>}
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
          {drone ? "Update" : "Create"} Drone
        </button>
      </div>
    </form>
  );
};

export default DroneForm;
