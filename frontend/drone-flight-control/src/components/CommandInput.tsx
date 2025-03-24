"use client";

import type React from "react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useApi } from "../context/ApiContext";
import type { Drone, Matrix } from "../types";

interface CommandInputProps {
  drone: Drone;
  matrix?: Matrix;
  onCommandExecuted?: (updatedDrone: Drone) => void;
}

const CommandInput = ({
  drone,
  matrix,
  onCommandExecuted,
}: CommandInputProps) => {
  const { executeCommands } = useApi();
  const [commands, setCommands] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [previewPath, setPreviewPath] = useState<{ x: number; y: number }[]>(
    []
  );

  useEffect(() => {
    setPreviewPath([]);
  }, [drone]);

  const calculatePreviewPath = (
    droneX: number,
    droneY: number,
    droneOrientation: string,
    commandString: string
  ) => {
    if (!matrix) return [];

    const path: { x: number; y: number }[] = [{ x: droneX, y: droneY }];
    let x = droneX;
    let y = droneY;
    let orientation = droneOrientation;

    for (const command of commandString) {
      switch (command) {
        case "F":
          switch (orientation) {
            case "NORTH":
              y = Math.min(y + 1, matrix.maxY - 1);
              break;
            case "EAST":
              x = Math.min(x + 1, matrix.maxX - 1);
              break;
            case "SOUTH":
              y = Math.max(y - 1, 0);
              break;
            case "WEST":
              x = Math.max(x - 1, 0);
              break;
          }
          break;
        case "B":
          switch (orientation) {
            case "NORTH":
              y = Math.max(y - 1, 0);
              break;
            case "EAST":
              x = Math.max(x - 1, 0);
              break;
            case "SOUTH":
              y = Math.min(y + 1, matrix.maxY - 1);
              break;
            case "WEST":
              x = Math.min(x + 1, matrix.maxX - 1);
              break;
          }
          break;
        case "L":
          switch (orientation) {
            case "NORTH":
              orientation = "WEST";
              break;
            case "EAST":
              orientation = "NORTH";
              break;
            case "SOUTH":
              orientation = "EAST";
              break;
            case "WEST":
              orientation = "SOUTH";
              break;
          }
          break;
        case "R":
          switch (orientation) {
            case "NORTH":
              orientation = "EAST";
              break;
            case "EAST":
              orientation = "SOUTH";
              break;
            case "SOUTH":
              orientation = "WEST";
              break;
            case "WEST":
              orientation = "NORTH";
              break;
          }
          break;
      }

      if (command === "F" || command === "B") {
        path.push({ x, y });
      }
    }

    return path;
  };

  const handleCommandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCommands = e.target.value.toUpperCase().replace(/[^FBLR]/g, "");
    setCommands(newCommands);

    if (matrix) {
      const path = calculatePreviewPath(
        drone.x,
        drone.y,
        drone.orientation,
        newCommands
      );
      setPreviewPath(path);
    }
  };

  const handleExecute = async () => {
    if (!commands.trim()) {
      toast.error("Please enter commands");
      return;
    }

    setIsExecuting(true);

    try {
      const updatedDrone = await executeCommands(drone.id, commands);
      toast.success("Commands executed successfully");

      setCommandHistory((prev) => [commands, ...prev].slice(0, 10));

      if (onCommandExecuted) {
        onCommandExecuted(updatedDrone);
      }

      setCommands("");
      setPreviewPath([]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to execute commands"
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const handleQuickCommand = (command: string) => {
    setCommands((prev) => prev + command);

    if (matrix) {
      const newCommands = commands + command;
      const path = calculatePreviewPath(
        drone.x,
        drone.y,
        drone.orientation,
        newCommands
      );
      setPreviewPath(path);
    }
  };

  const handleHistorySelect = (historyCommand: string) => {
    setCommands(historyCommand);

    if (matrix) {
      const path = calculatePreviewPath(
        drone.x,
        drone.y,
        drone.orientation,
        historyCommand
      );
      setPreviewPath(path);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="commands"
          className="block text-sm font-medium text-gray-700"
        >
          Commands
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="commands"
            value={commands}
            onChange={handleCommandChange}
            placeholder="e.g., FFRFFLF"
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleExecute}
            disabled={isExecuting || !commands}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isExecuting ? "Executing..." : "Execute"}
          </button>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => handleQuickCommand("F")}
          className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Forward (F)
        </button>
        <button
          type="button"
          onClick={() => handleQuickCommand("B")}
          className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Backward (B)
        </button>
        <button
          type="button"
          onClick={() => handleQuickCommand("L")}
          className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Left (L)
        </button>
        <button
          type="button"
          onClick={() => handleQuickCommand("R")}
          className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Right (R)
        </button>
      </div>

      {matrix && previewPath.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Path Preview
          </h4>
          <div className="overflow-auto">
            <MatrixGrid
              matrix={matrix}
              selectedDrone={drone}
              highlightedCells={previewPath}
              cellSize={24}
              showCoordinates={true}
              interactive={false}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Yellow cells show the predicted path based on your commands
          </p>
        </div>
      )}

      {commandHistory.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Command History
          </h4>
          <div className="flex flex-wrap gap-2">
            {commandHistory.map((cmd, index) => (
              <button
                key={index}
                onClick={() => handleHistorySelect(cmd)}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      )}

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

import MatrixGrid from "./MatrixGrid";

export default CommandInput;
