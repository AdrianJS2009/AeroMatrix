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
    orientation: "N", // Cambia según tus enums o valores ("N", "E", "S", "O")
    matrixId: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Al montar, obtenemos la lista de matrices
  useEffect(() => {
    const fetchMatrices = async () => {
      try {
        const data = await getAllMatrices();
        setMatrices(data);

        // Si no hay drone y existe al menos una matriz, seleccionamos la primera
        if (!drone && data.length > 0 && !formData.matrixId) {
          setFormData((prev) => ({ ...prev, matrixId: data[0].id }));
        }
      } catch (error) {
        toast.error("Failed to fetch matrices");
      }
    };

    fetchMatrices();
  }, [getAllMatrices, drone, formData.matrixId]);

  // Ajusta x e y cuando cambia la matrix seleccionada
  useEffect(() => {
    const selectedMatrix = matrices.find((m) => m.id === formData.matrixId);
    if (selectedMatrix) {
      setFormData((prev) => ({
        ...prev,
        x: Math.min(prev.x, selectedMatrix.maxX - 1),
        y: Math.min(prev.y, selectedMatrix.maxY - 1),
      }));
    }
  }, [formData.matrixId, matrices]);

  // Si recibimos un drone para editar, inicializamos el formulario
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

  // Validaciones del formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.model?.trim()) {
      newErrors.model = "Model is required";
    }

    if (formData.matrixId == null) {
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

    // Revisamos si la posición excede los límites de la matriz seleccionada
    const selectedMatrix = matrices.find((m) => m.id === formData.matrixId);
    if (selectedMatrix) {
      if (formData.x >= selectedMatrix.maxX) {
        newErrors.x = `X position must be less than matrix width (${selectedMatrix.maxX})`;
      }
      if (formData.y >= selectedMatrix.maxY) {
        newErrors.y = `Y position must be less than matrix height (${selectedMatrix.maxY})`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejamos el cambio de valores en el formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: ["x", "y", "matrixId"].includes(name) ? Number(value) : value,
    }));
  };

  // Al enviar el formulario, creamos o actualizamos el drone
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let result: Drone;

      if (drone) {
        // Modo edición
        result = await updateDrone(drone.id, formData);
        toast.success("Drone updated successfully");
      } else {
        // Modo creación
        result = await createDrone(formData as CreateDroneRequest);
        toast.success("Drone created successfully");
      }

      if (onSubmit) {
        onSubmit(result);
      } else {
        // Redirigimos a la vista del drone creado/actualizado
        navigate(`/drones/${result.id}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedMatrix = () => {
    return matrices.find((m) => m.id === formData.matrixId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
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

        {/* Modelo */}
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

        {/* Selección de la matriz */}
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
            value={formData.matrixId ?? ""}
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

        {/* Orientación */}
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
            <option value="N">North</option>
            <option value="E">East</option>
            <option value="S">South</option>
            <option value="O">West</option>
          </select>
          {errors.orientation && (
            <p className="mt-1 text-sm text-red-600">{errors.orientation}</p>
          )}
        </div>

        {/* Posición X */}
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
            max={
              getSelectedMatrix()?.maxX
                ? getSelectedMatrix()!.maxX - 1
                : undefined
            }
            value={formData.x || 0}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.x ? "border-red-500" : ""
            }`}
          />
          {errors.x && <p className="mt-1 text-sm text-red-600">{errors.x}</p>}
          {getSelectedMatrix() && (
            <p className="mt-1 text-xs text-gray-500">
              Valid range: 0 to {getSelectedMatrix()!.maxX - 1}
            </p>
          )}
        </div>

        {/* Posición Y */}
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
            max={
              getSelectedMatrix()?.maxY
                ? getSelectedMatrix()!.maxY - 1
                : undefined
            }
            value={formData.y || 0}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.y ? "border-red-500" : ""
            }`}
          />
          {errors.y && <p className="mt-1 text-sm text-red-600">{errors.y}</p>}
          {getSelectedMatrix() && (
            <p className="mt-1 text-xs text-gray-500">
              Valid range: 0 to {getSelectedMatrix()!.maxY - 1}
            </p>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : drone ? "Update" : "Create"} Drone
        </button>
      </div>
    </form>
  );
};

export default DroneForm;
