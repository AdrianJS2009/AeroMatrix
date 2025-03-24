"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BatchCommandInput from "../components/BatchCommandInput";
import CommandInput from "../components/CommandInput";
import ConfigurationManager from "../components/ConfigurationManager";
import DroneDirectionalIcon from "../components/DronEDirectionalIcon";
import MatrixGrid from "../components/MatrixGrid";
import { useApi } from "../context/ApiContext";
import type { BatchDroneCommand, Drone, Matrix } from "../types";

const FlightControl = () => {
  const {
    getAllMatrices,
    getMatrixById,
    executeCommands,
    executeBatchCommands,
  } = useApi();
  const [matrices, setMatrices] = useState<Matrix[]>([]);
  const [selectedMatrix, setSelectedMatrix] = useState<Matrix | null>(null);
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);
  const [controlMode, setControlMode] = useState<"single" | "batch" | "config">(
    "single"
  );
  const [loading, setLoading] = useState(true);
  const [executingCommands, setExecutingCommands] = useState(false);
  const [showOrientationLabels, setShowOrientationLabels] = useState(true);

  useEffect(() => {
    fetchMatrices();
  }, []);

  const fetchMatrices = async () => {
    try {
      const data = await getAllMatrices();
      setMatrices(data);

      if (data.length > 0) {
        setSelectedMatrix(data[0]);
      }
    } catch (error) {
      toast.error("Failed to fetch matrices");
    } finally {
      setLoading(false);
    }
  };

  const handleMatrixChange = async (matrixId: number) => {
    try {
      const matrix = await getMatrixById(matrixId);
      setSelectedMatrix(matrix);
      setSelectedDrone(null);
    } catch (error) {
      toast.error("Failed to fetch matrix details");
    }
  };

  const handleSelectDrone = (drone: Drone) => {
    setSelectedDrone(drone);
    setControlMode("single");
  };

  const handleCommandExecuted = async (updatedDrone?: Drone) => {
    if (selectedMatrix) {
      try {
        const matrix = await getMatrixById(selectedMatrix.id);
        setSelectedMatrix(matrix);

        if (updatedDrone) {
          const refreshedDrone = matrix.drones.find(
            (d) => d.id === updatedDrone.id
          );
          setSelectedDrone(refreshedDrone || null);
        }
      } catch (error) {
        toast.error("Failed to refresh matrix data");
      }
    }
  };

  const handleLoadConfiguration = async (
    drones: Drone[],
    commands: Record<number, string>
  ) => {
    if (!selectedMatrix || Object.keys(commands).length === 0) return;

    setExecutingCommands(true);

    try {
      // Create batch commands from the configuration
      const batchCommands: BatchDroneCommand[] = Object.entries(commands)
        .filter(([_, cmd]) => cmd.trim() !== "")
        .map(([droneId, cmd]) => ({
          droneId: Number(droneId),
          commands: cmd,
        }));

      if (batchCommands.length === 0) {
        toast.error("No valid commands found in configuration");
        return;
      }

      // Execute batch commands
      await executeBatchCommands({ commands: batchCommands });
      toast.success("Configuration commands executed successfully");

      // Refresh matrix data
      const matrix = await getMatrixById(selectedMatrix.id);
      setSelectedMatrix(matrix);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to execute configuration commands"
      );
    } finally {
      setExecutingCommands(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Flight Control</h1>
      </div>

      {matrices.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 mb-4">
            No matrices available. Create a matrix to get started.
          </p>
          <a
            href="/matrices/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Matrix
          </a>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <label
                  htmlFor="matrix-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Matrix
                </label>
                <select
                  id="matrix-select"
                  value={selectedMatrix?.id || ""}
                  onChange={(e) => handleMatrixChange(Number(e.target.value))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {matrices.map((matrix) => (
                    <option key={matrix.id} value={matrix.id}>
                      Matrix {matrix.id} ({matrix.maxX}x{matrix.maxY}) -{" "}
                      {matrix.drones.length} drones
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:w-2/3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Control Mode
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="control-mode"
                          value="single"
                          checked={controlMode === "single"}
                          onChange={() => setControlMode("single")}
                        />
                        <span className="ml-2">Single Drone</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="control-mode"
                          value="batch"
                          checked={controlMode === "batch"}
                          onChange={() => setControlMode("batch")}
                        />
                        <span className="ml-2">Batch Control</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="control-mode"
                          value="config"
                          checked={controlMode === "config"}
                          onChange={() => setControlMode("config")}
                        />
                        <span className="ml-2">Configurations</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={showOrientationLabels}
                        onChange={() =>
                          setShowOrientationLabels(!showOrientationLabels)
                        }
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Show orientation labels
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedMatrix && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Matrix Grid
              </h3>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                  <MatrixGrid
                    matrix={selectedMatrix}
                    selectedDrone={selectedDrone}
                    onSelectDrone={handleSelectDrone}
                    cellSize={36}
                    showCoordinates={true}
                    showOrientationLabels={showOrientationLabels}
                  />
                </div>
                <div className="md:w-1/3">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      Matrix Info
                    </h4>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Size:</span>{" "}
                      {selectedMatrix.maxX} x {selectedMatrix.maxY}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Drones:</span>{" "}
                      {selectedMatrix.drones.length}
                    </p>
                  </div>

                  {selectedDrone && (
                    <div className="bg-gray-50 p-4 rounded-md mt-4">
                      <h4 className="text-md font-medium text-gray-700 mb-2">
                        Selected Drone
                      </h4>
                      <div className="flex items-center mb-2">
                        <span className="font-medium mr-2">Orientation:</span>
                        <DroneDirectionalIcon
                          orientation={selectedDrone.orientation}
                          size="md"
                          showLabel={true}
                        />
                        <span className="ml-2">
                          {selectedDrone.orientation}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Name:</span>{" "}
                        {selectedDrone.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Position:</span> (
                        {selectedDrone.x}, {selectedDrone.y})
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Model:</span>{" "}
                        {selectedDrone.model}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedMatrix && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {controlMode === "single"
                  ? "Single Drone Control"
                  : controlMode === "batch"
                  ? "Batch Drone Control"
                  : "Configuration Management"}
              </h3>

              {controlMode === "single" ? (
                selectedDrone ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <h4 className="text-md font-medium text-gray-700 mb-2">
                        Selected Drone
                      </h4>
                      <div className="flex items-center mb-2">
                        <span className="font-medium mr-2">Orientation:</span>
                        <DroneDirectionalIcon
                          orientation={selectedDrone.orientation}
                          size="md"
                          showLabel={true}
                        />
                        <span className="ml-2">
                          {selectedDrone.orientation}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Name:</span>{" "}
                        {selectedDrone.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Position:</span> (
                        {selectedDrone.x}, {selectedDrone.y})
                      </p>
                    </div>

                    <CommandInput
                      drone={selectedDrone}
                      matrix={selectedMatrix}
                      onCommandExecuted={handleCommandExecuted}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Select a drone from the grid to control it.
                  </p>
                )
              ) : controlMode === "batch" ? (
                <BatchCommandInput
                  drones={selectedMatrix.drones}
                  onCommandsExecuted={() => handleCommandExecuted()}
                />
              ) : (
                <ConfigurationManager
                  drones={selectedMatrix.drones}
                  matrix={selectedMatrix}
                  onLoadConfiguration={handleLoadConfiguration}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FlightControl;
