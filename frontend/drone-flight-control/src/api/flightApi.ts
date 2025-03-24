import type { BatchDroneCommandRequest, Drone } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const flightApi = {
  executeCommands: async (
    droneId: number,
    commands: string
  ): Promise<Drone> => {
    const response = await fetch(
      `${API_URL}/api/flights/drones/${droneId}/commands`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commands }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to execute commands");
    }
    return response.json();
  },

  executeCommandsInSequence: async (
    droneIds: number[],
    commands: string
  ): Promise<void> => {
    const response = await fetch(
      `${API_URL}/api/flights/drones/commands?droneIds=${droneIds.join(",")}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commands }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || "Failed to execute commands in sequence"
      );
    }
  },

  executeBatchCommands: async (
    batchCommands: BatchDroneCommandRequest
  ): Promise<void> => {
    const response = await fetch(`${API_URL}/api/flights/batch-commands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchCommands),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to execute batch commands");
    }
  },
};
