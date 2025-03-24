"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useApi } from "../context/ApiContext";
import type { Drone } from "../types";

interface CommandInputProps {
  drone: Drone;
  onCommandExecuted?: (updatedDrone: Drone) => void;
}

const CommandInput = ({ drone, onCommandExecuted }: CommandInputProps) => {
  const { executeCommands } = useApi();
  const [commands, setCommands] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    if (!commands.trim()) {
      toast.error("Please enter commands");
      return;
    }

    setIsExecuting(true);

    try {
      const updatedDrone = await executeCommands(drone.id, commands);
      toast.success("Commands executed successfully");

      if (onCommandExecuted) {
        onCommandExecuted(updatedDrone);
      }

      setCommands("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to execute commands"
      );
    } finally {
      setIsExecuting(false);
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
            onChange={(e) => setCommands(e.target.value)}
            placeholder="e.g., FFRFFLF"
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleExecute}
            disabled={isExecuting}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isExecuting ? "Executing..." : "Execute"}
          </button>
        </div>
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

export default CommandInput;
