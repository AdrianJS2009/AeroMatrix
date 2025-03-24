import type { CreateDroneRequest, Drone, UpdateDroneRequest } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const droneApi = {
  getAllDrones: async (): Promise<Drone[]> => {
    const response = await fetch(`${API_URL}/api/drones`);
    if (!response.ok) {
      throw new Error("Failed to fetch drones");
    }
    return response.json();
  },

  getDroneById: async (id: number): Promise<Drone> => {
    const response = await fetch(`${API_URL}/api/drones/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch drone with id ${id}`);
    }
    return response.json();
  },

  createDrone: async (drone: CreateDroneRequest): Promise<Drone> => {
    const response = await fetch(`${API_URL}/api/drones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(drone),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to create drone");
    }
    return response.json();
  },

  updateDrone: async (
    id: number,
    drone: UpdateDroneRequest
  ): Promise<Drone> => {
    const response = await fetch(`${API_URL}/api/drones/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(drone),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Failed to update drone with id ${id}`
      );
    }
    return response.json();
  },

  deleteDrone: async (id: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/api/drones/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete drone with id ${id}`);
    }
    return response.json();
  },
};
