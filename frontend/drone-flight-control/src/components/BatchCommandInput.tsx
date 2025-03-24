"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useApi } from "../context/ApiContext";
import type { BatchDroneCommand, Drone } from "../types";

interface BatchCommandInputProps {
  drones: Drone[];
  onCommandsExecuted?: () => void;
}

const BatchCommandInput = ({
  drones,
  onCommandsExecuted,
}: BatchCommandInputProps) => {
  const { executeBatchCommands } = useApi();
  const [batchCommands, setBatchCommands] = useState<BatchDroneCommand[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    // Initialize batch commands with available drones
    const initialBatchCommands = drones.map((drone) => ({
      droneId: drone.id,
      commands: "",
    }));

    setBatchCommands(initialBatchCommands);
  }, [drones]);

  const handleCommandChange = (index: number, commands: string) => {
    const updatedBatchCommands = [...batchCommands];
    updatedBatchCommands[index] = {
      ...updatedBatchCommands[index],
      commands,
    };

    setBatchCommands(updatedBatchCommands);
  };

  const handleExecute = async () => {
    // Filter out empty commands
    const commandsToExecute = batchCommands.filter(
      (cmd) => cmd.commands.trim() !== ""
    );

    if (commandsToExecute.length === 0) {
      toast.error("Please enter at least one command");
      return;
    }

    setIsExecuting(true);

    try {
      await executeBatchCommands({ commands: commandsToExecute });
      toast.success("Batch commands executed successfully");

      // Reset commands
      const resetBatchCommands = batchCommands.map((cmd) => ({
        ...cmd,
        commands: "",
      }));

      setBatchCommands(resetBatchCommands);

      if (onCommandsExecuted) {
        onCommandsExecuted();
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to execute batch commands"
      );
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {batchCommands.map((batchCommand, index) => {
          const drone = drones.find((d) => d.id === batchCommand.droneId);

          return (
            <div
              key={batchCommand.droneId}
              className="flex items-center space-x-4"
            >
              <div className="w-1/3">
                <span className="text-sm font-medium text-gray-700">
                  {drone?.name} (ID: {drone?.id})
                </span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={batchCommand.commands}
                  onChange={(e) => handleCommandChange(index, e.target.value)}
                  placeholder="e.g., FFRFFLF"
                  className="block w-full px-3 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleExecute}
          disabled={isExecuting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isExecuting ? "Executing..." : "Execute Batch Commands"}
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Command Reference:
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            <strong>F</strong> - Move forward one step
          </li>
          <li>
            <strong>B</strong> - Move backward one step
          </li>
          <li>
            <strong>L</strong> - Turn left (90 degrees)
          </li>
          <li>
            <strong>R</strong> - Turn right (90 degrees)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BatchCommandInput;
