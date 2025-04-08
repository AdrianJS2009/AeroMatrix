import type {
  CreateMatrixRequest,
  Matrix,
  UpdateMatrixRequest,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const matrixApi = {
  getAllMatrices: async (): Promise<Matrix[]> => {
    const response = await fetch(`${API_URL}/api/matrices`);
    if (!response.ok) {
      throw new Error("Failed to fetch matrices");
    }
    return response.json();
  },

  getMatrixById: async (id: number): Promise<Matrix> => {
    const response = await fetch(`${API_URL}/api/matrices/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch matrix with id ${id}`);
    }
    return response.json();
  },

  createMatrix: async (matrix: CreateMatrixRequest): Promise<Matrix> => {
    const response = await fetch(`${API_URL}/api/matrices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matrix),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to create matrix");
    }
    return response.json();
  },

  updateMatrix: async (
    id: number,
    matrix: UpdateMatrixRequest
  ): Promise<Matrix> => {
    const response = await fetch(`${API_URL}/api/matrices/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matrix),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Failed to update matrix with id ${id}`
      );
    }
    return response.json();
  },

  deleteMatrix: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/matrices/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete matrix with id ${id}`);
    }
  },
};
