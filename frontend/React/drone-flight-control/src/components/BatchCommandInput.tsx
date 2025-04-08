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
  const [commandHistory, setCommandHistory] = useState<
    Record<number, string[]>
  >({});

  useEffect(() => {
    const initialBatchCommands = drones.map((drone) => ({
      droneId: drone.id,
      commands: "",
    }));
    setBatchCommands(initialBatchCommands);

    const initialHistory: Record<number, string[]> = {};
    drones.forEach((drone) => {
      initialHistory[drone.id] = [];
    });

    try {
      const savedHistory = localStorage.getItem("droneCommandHistory");
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setCommandHistory(parsedHistory);
      } else {
        setCommandHistory(initialHistory);
      }
    } catch (error) {
      console.error("Failed to load command history:", error);
      setCommandHistory(initialHistory);
    }
  }, [drones]);

  const handleCommandChange = (index: number, commands: string) => {
    const updatedBatchCommands = [...batchCommands];
    updatedBatchCommands[index] = {
      ...updatedBatchCommands[index],
      commands: commands.toUpperCase().replace(/[^FBLR]/g, ""),
    };
    setBatchCommands(updatedBatchCommands);
  };

  const handleQuickCommand = (index: number, command: string) => {
    const updatedBatchCommands = [...batchCommands];
    updatedBatchCommands[index] = {
      ...updatedBatchCommands[index],
      commands: updatedBatchCommands[index].commands + command,
    };
    setBatchCommands(updatedBatchCommands);
  };

  const handleHistorySelect = (droneId: number, historyCommand: string) => {
    const index = batchCommands.findIndex((cmd) => cmd.droneId === droneId);
    if (index !== -1) {
      const updatedBatchCommands = [...batchCommands];
      updatedBatchCommands[index] = {
        ...updatedBatchCommands[index],
        commands: historyCommand,
      };
      setBatchCommands(updatedBatchCommands);
    }
  };

  const handleClearCommand = (index: number) => {
    const updatedBatchCommands = [...batchCommands];
    updatedBatchCommands[index] = {
      ...updatedBatchCommands[index],
      commands: "",
    };
    setBatchCommands(updatedBatchCommands);
  };

  const mapCommandLetter = (letter: string): string => {
    switch (letter) {
      case "F":
        return "MOVE_FORWARD";
      case "L":
        return "TURN_LEFT";
      case "R":
        return "TURN_RIGHT";

      default:
        return "";
    }
  };

  const handleExecute = async () => {
    const commandsToExecute = batchCommands.filter(
      (cmd) => cmd.commands.trim() !== ""
    );

    if (commandsToExecute.length === 0) {
      toast.error("Please enter at least one command");
      return;
    }

    const transformedCommands = commandsToExecute.map((cmd) => {
      const commandArray = cmd.commands
        .split("")
        .map(mapCommandLetter)
        .filter((c) => c !== "");
      return {
        droneId: cmd.droneId,
        commands: commandArray,
      };
    });

    setIsExecuting(true);

    try {
      await executeBatchCommands({ commands: transformedCommands });
      toast.success("Batch commands executed successfully");

      const updatedHistory = { ...commandHistory };
      commandsToExecute.forEach((cmd) => {
        if (!updatedHistory[cmd.droneId]) {
          updatedHistory[cmd.droneId] = [];
        }
        if (!updatedHistory[cmd.droneId].includes(cmd.commands)) {
          updatedHistory[cmd.droneId] = [
            cmd.commands,
            ...updatedHistory[cmd.droneId],
          ].slice(0, 5);
        }
      });

      setCommandHistory(updatedHistory);
      localStorage.setItem(
        "droneCommandHistory",
        JSON.stringify(updatedHistory)
      );

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
          const droneHistory = commandHistory[batchCommand.droneId] || [];

          return (
            <div
              key={batchCommand.droneId}
              className="bg-white border border-gray-200 rounded-md p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {drone?.name} (ID: {drone?.id})
                </span>
                <span className="text-xs text-gray-500">
                  Position: ({drone?.x}, {drone?.y}) - {drone?.orientation}
                </span>
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={batchCommand.commands}
                  onChange={(e) => handleCommandChange(index, e.target.value)}
                  placeholder="e.g., FFRFFLF"
                  className="flex-1 block w-full px-3 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleClearCommand(index)}
                  className="px-2 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  title="Clear"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex space-x-2 mb-2">
                <button
                  type="button"
                  onClick={() => handleQuickCommand(index, "F")}
                  className="px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Forward (F)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCommand(index, "B")}
                  className="px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Backward (B)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCommand(index, "L")}
                  className="px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Left (L)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCommand(index, "R")}
                  className="px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Right (R)
                </button>
              </div>

              {droneHistory.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-gray-500 mr-2">History:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {droneHistory.map((cmd, historyIndex) => (
                      <button
                        key={historyIndex}
                        onClick={() =>
                          handleHistorySelect(batchCommand.droneId, cmd)
                        }
                        className="px-2 py-1 text-xs bg-gray-100 border border-gray-200 rounded hover:bg-gray-200"
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleExecute}
          disabled={
            isExecuting || batchCommands.every((cmd) => !cmd.commands.trim())
          }
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
