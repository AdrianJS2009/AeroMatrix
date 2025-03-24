"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
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

  const getAllDrones = useCallback(async (): Promise<Drone[]> => {
    setLoading(true);
    try {
      return await droneApi.getAllDrones();
    } finally {
      setLoading(false);
    }
  }, []);

  const getDroneById = useCallback(async (id: number): Promise<Drone> => {
    setLoading(true);
    try {
      return await droneApi.getDroneById(id);
    } finally {
      setLoading(false);
    }
  }, []);

  const createDrone = useCallback(
    async (drone: CreateDroneRequest): Promise<Drone> => {
      setLoading(true);
      try {
        return await droneApi.createDrone(drone);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateDrone = useCallback(
    async (id: number, drone: UpdateDroneRequest): Promise<Drone> => {
      setLoading(true);
      try {
        return await droneApi.updateDrone(id, drone);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteDrone = useCallback(
    async (id: number): Promise<{ message: string }> => {
      setLoading(true);
      try {
        return await droneApi.deleteDrone(id);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getAllMatrices = useCallback(async (): Promise<Matrix[]> => {
    setLoading(true);
    try {
      return await matrixApi.getAllMatrices();
    } finally {
      setLoading(false);
    }
  }, []);

  const getMatrixById = useCallback(async (id: number): Promise<Matrix> => {
    setLoading(true);
    try {
      return await matrixApi.getMatrixById(id);
    } finally {
      setLoading(false);
    }
  }, []);

  const createMatrix = useCallback(
    async (matrix: CreateMatrixRequest): Promise<Matrix> => {
      setLoading(true);
      try {
        return await matrixApi.createMatrix(matrix);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateMatrix = useCallback(
    async (id: number, matrix: UpdateMatrixRequest): Promise<Matrix> => {
      setLoading(true);
      try {
        return await matrixApi.updateMatrix(id, matrix);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteMatrix = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    try {
      await matrixApi.deleteMatrix(id);
    } finally {
      setLoading(false);
    }
  }, []);

  const executeCommands = useCallback(
    async (droneId: number, commands: string): Promise<Drone> => {
      setLoading(true);
      try {
        return await flightApi.executeCommands(droneId, commands);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const executeCommandsInSequence = useCallback(
    async (droneIds: number[], commands: string): Promise<void> => {
      setLoading(true);
      try {
        await flightApi.executeCommandsInSequence(droneIds, commands);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const executeBatchCommands = useCallback(
    async (batchCommands: BatchDroneCommandRequest): Promise<void> => {
      setLoading(true);
      try {
        await flightApi.executeBatchCommands(batchCommands);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const value: ApiContextType = {
    getAllDrones,
    getDroneById,
    createDrone,
    updateDrone,
    deleteDrone,
    getAllMatrices,
    getMatrixById,
    createMatrix,
    updateMatrix,
    deleteMatrix,
    executeCommands,
    executeCommandsInSequence,
    executeBatchCommands,
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
