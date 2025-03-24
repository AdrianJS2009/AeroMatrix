"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Drone, DroneConfiguration, Matrix } from "../types";

interface ConfigurationManagerProps {
  drones: Drone[];
  matrix: Matrix;
  onLoadConfiguration?: (
    drones: Drone[],
    commands: Record<number, string>
  ) => void;
}

const ConfigurationManager = ({
  drones,
  matrix,
  onLoadConfiguration,
}: ConfigurationManagerProps) => {
  const [configurations, setConfigurations] = useState<DroneConfiguration[]>(
    []
  );
  const [configName, setConfigName] = useState("");
  const [selectedCommands, setSelectedCommands] = useState<
    Record<number, string>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadConfigurations();
  }, []);

  useEffect(() => {
    // Initialize selected commands for each drone
    const initialCommands: Record<number, string> = {};
    drones.forEach((drone) => {
      initialCommands[drone.id] = "";
    });
    setSelectedCommands(initialCommands);
  }, [drones]);

  const loadConfigurations = () => {
    try {
      const savedConfigs = localStorage.getItem("droneConfigurations");
      if (savedConfigs) {
        setConfigurations(JSON.parse(savedConfigs));
      }
    } catch (error) {
      console.error("Failed to load configurations:", error);
      toast.error("Failed to load saved configurations");
    }
  };

  const handleSaveConfiguration = () => {
    if (!configName.trim()) {
      toast.error("Please enter a configuration name");
      return;
    }

    setIsSaving(true);

    try {
      const newConfig: DroneConfiguration = {
        id: Date.now().toString(),
        name: configName,
        drones: drones.map((drone) => ({ ...drone })),
        commands: { ...selectedCommands },
        createdAt: new Date().toISOString(),
      };

      const updatedConfigs = [...configurations, newConfig];
      localStorage.setItem(
        "droneConfigurations",
        JSON.stringify(updatedConfigs)
      );
      setConfigurations(updatedConfigs);
      setConfigName("");
      toast.success("Configuration saved successfully");
    } catch (error) {
      console.error("Failed to save configuration:", error);
      toast.error("Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadConfiguration = (config: DroneConfiguration) => {
    setIsLoading(true);

    try {
      if (onLoadConfiguration) {
        onLoadConfiguration(config.drones, config.commands);
      }
      toast.success("Configuration loaded successfully");
    } catch (error) {
      console.error("Failed to load configuration:", error);
      toast.error("Failed to load configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfiguration = (configId: string) => {
    try {
      const updatedConfigs = configurations.filter(
        (config) => config.id !== configId
      );
      localStorage.setItem(
        "droneConfigurations",
        JSON.stringify(updatedConfigs)
      );
      setConfigurations(updatedConfigs);
      toast.success("Configuration deleted successfully");
    } catch (error) {
      console.error("Failed to delete configuration:", error);
      toast.error("Failed to delete configuration");
    }
  };

  const handleCommandChange = (droneId: number, command: string) => {
    setSelectedCommands((prev) => ({
      ...prev,
      [droneId]: command.toUpperCase().replace(/[^FBLR]/g, ""),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Save Current Configuration
        </h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="configName"
              className="block text-sm font-medium text-gray-700"
            >
              Configuration Name
            </label>
            <input
              type="text"
              id="configName"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., My Drone Setup"
            />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">
              Commands for Each Drone
            </h4>
            {drones.map((drone) => (
              <div key={drone.id} className="flex items-center space-x-4">
                <div className="w-1/3">
                  <span className="text-sm font-medium text-gray-700">
                    {drone.name} (ID: {drone.id})
                  </span>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={selectedCommands[drone.id] || ""}
                    onChange={(e) =>
                      handleCommandChange(drone.id, e.target.value)
                    }
                    placeholder="e.g., FFRFFLF"
                    className="block w-full px-3 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveConfiguration}
              disabled={isSaving || !configName.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Saved Configurations
        </h3>

        {configurations.length === 0 ? (
          <p className="text-gray-500">No saved configurations yet.</p>
        ) : (
          <div className="space-y-4">
            {configurations.map((config) => (
              <div
                key={config.id}
                className="border border-gray-200 rounded-md p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-medium text-gray-900">
                    {config.name}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {new Date(config.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {config.drones.length} drones
                </p>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => handleLoadConfiguration(config)}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteConfiguration(config.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurationManager;
