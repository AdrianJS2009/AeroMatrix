"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { droneApi } from "../api/droneApi";
import { flightApi } from "../api/flightApi";
import { matrixApi } from "../api/matrixApi";
import type {
  BatchDroneCommandRequest,
  CreateDroneRequest,
  CreateMatrixRequest,
  Drone,
  Matrix,
  UpdateDroneRequest,
  UpdateMatrixRequest,
} from "../types";

interface ApiContextType {
  // Drone operations
  getAllDrones: () => Promise<Drone[]>;
  getDroneById: (id: number) => Promise<Drone>;
  createDrone: (drone: CreateDroneRequest) => Promise<Drone>;
  updateDrone: (id: number, drone: UpdateDroneRequest) => Promise<Drone>;
  deleteDrone: (id: number) => Promise<{ message: string }>;

  // Matrix operations
  getAllMatrices: () => Promise<Matrix[]>;
  getMatrixById: (id: number) => Promise<Matrix>;
  createMatrix: (matrix: CreateMatrixRequest) => Promise<Matrix>;
  updateMatrix: (id: number, matrix: UpdateMatrixRequest) => Promise<Matrix>;
  deleteMatrix: (id: number) => Promise<void>;

  // Flight operations
  executeCommands: (droneId: number, commands: string) => Promise<Drone>;
  executeCommandsInSequence: (
    droneIds: number[],
    commands: string
  ) => Promise<void>;
  executeBatchCommands: (
    batchCommands: BatchDroneCommandRequest
  ) => Promise<void>;

  // Loading state
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const value: ApiContextType = {
    // Drone operations
    getAllDrones: async () => {
      setLoading(true);
      try {
        return await droneApi.getAllDrones();
      } finally {
        setLoading(false);
      }
    },
    getDroneById: async (id) => {
      setLoading(true);
      try {
        return await droneApi.getDroneById(id);
      } finally {
        setLoading(false);
      }
    },
    createDrone: async (drone) => {
      setLoading(true);
      try {
        return await droneApi.createDrone(drone);
      } finally {
        setLoading(false);
      }
    },
    updateDrone: async (id, drone) => {
      setLoading(true);
      try {
        return await droneApi.updateDrone(id, drone);
      } finally {
        setLoading(false);
      }
    },
    deleteDrone: async (id) => {
      setLoading(true);
      try {
        return await droneApi.deleteDrone(id);
      } finally {
        setLoading(false);
      }
    },

    // Matrix operations
    getAllMatrices: async () => {
      setLoading(true);
      try {
        return await matrixApi.getAllMatrices();
      } finally {
        setLoading(false);
      }
    },
    getMatrixById: async (id) => {
      setLoading(true);
      try {
        return await matrixApi.getMatrixById(id);
      } finally {
        setLoading(false);
      }
    },
    createMatrix: async (matrix) => {
      setLoading(true);
      try {
        return await matrixApi.createMatrix(matrix);
      } finally {
        setLoading(false);
      }
    },
    updateMatrix: async (id, matrix) => {
      setLoading(true);
      try {
        return await matrixApi.updateMatrix(id, matrix);
      } finally {
        setLoading(false);
      }
    },
    deleteMatrix: async (id) => {
      setLoading(true);
      try {
        await matrixApi.deleteMatrix(id);
      } finally {
        setLoading(false);
      }
    },

    // Flight operations
    executeCommands: async (droneId, commands) => {
      setLoading(true);
      try {
        return await flightApi.executeCommands(droneId, commands);
      } finally {
        setLoading(false);
      }
    },
    executeCommandsInSequence: async (droneIds, commands) => {
      setLoading(true);
      try {
        await flightApi.executeCommandsInSequence(droneIds, commands);
      } finally {
        setLoading(false);
      }
    },
    executeBatchCommands: async (batchCommands) => {
      setLoading(true);
      try {
        await flightApi.executeBatchCommands(batchCommands);
      } finally {
        setLoading(false);
      }
    },

    loading,
    setLoading,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
