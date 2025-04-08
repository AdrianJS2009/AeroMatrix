"use client";

import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import DroneDirectionalIcon from "../components/DroneDirectionalIcon";
import MatrixGrid from "../components/MatrixGrid";
import { useApi } from "../context/ApiContext";
import type { Drone, Matrix } from "../types";

const MatrixDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMatrixById, deleteMatrix } = useApi();
  const [matrix, setMatrix] = useState<Matrix | null>(null);
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOrientationLabels, setShowOrientationLabels] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  useEffect(() => {
    if (id === "new") {
      setLoading(false);
      return;
    }

    fetchMatrix();
  }, [id]);

  const fetchMatrix = async () => {
    if (!id || id === "new") return;

    try {
      const data = await getMatrixById(Number(id));
      setMatrix(data);
    } catch (error) {
      toast.error("Failed to fetch matrix details");
      navigate("/matrix-management");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!matrix) return;

    try {
      await deleteMatrix(matrix.id);
      toast.success("Matrix deleted successfully");
      navigate("/matrix-management");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete matrix"
      );
    } finally {
      setDeleteConfirmation(false);
    }
  };

  const handleSelectDrone = (drone: Drone) => {
    setSelectedDrone(drone);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (id === "new") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add Matrix
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            Matrix form will be displayed here.
          </p>
        </div>
      </div>
    );
  }

  if (!matrix) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Matrix not found.
        </p>
        <Link
          to="/matrix-management"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
        >
          Back to Matrix Management
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate("/matrix-management")}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Back to Matrix Management"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Matrix {matrix.id}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Size: {matrix.maxX} x {matrix.maxY} • {matrix.drones.length} drone
            {matrix.drones.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/matrix/edit/${matrix.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
          <button
            onClick={() => setDeleteConfirmation(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-red-400 transition-colors"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Matrix Grid
          </h3>
          <div className="flex items-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={showOrientationLabels}
                onChange={() =>
                  setShowOrientationLabels(!showOrientationLabels)
                }
                className="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-500 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Show orientation labels
              </span>
            </label>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <MatrixGrid
              matrix={matrix}
              selectedDrone={selectedDrone}
              onSelectDrone={handleSelectDrone}
              cellSize={36}
              showCoordinates={true}
              showOrientationLabels={showOrientationLabels}
            />
          </div>
          <div className="md:w-1/3">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selected Drone
              </h4>
              {selectedDrone ? (
                <div className="space-y-2">
                  <div className="flex items-center mb-2">
                    <span className="font-medium mr-2 text-gray-700 dark:text-gray-300">
                      Orientation:
                    </span>
                    <DroneDirectionalIcon
                      orientation={selectedDrone.orientation}
                      size="md"
                      showLabel={true}
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      {selectedDrone.orientation}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Name:
                    </span>{" "}
                    {selectedDrone.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Model:
                    </span>{" "}
                    {selectedDrone.model}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Position:
                    </span>{" "}
                    ({selectedDrone.x}, {selectedDrone.y})
                  </p>
                  <div className="pt-2">
                    <Link
                      to={`/drones/${selectedDrone.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                    >
                      View Drone
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click on a drone in the grid to select it.
                </p>
              )}
            </div>

            <div className="mt-4">
              <Link
                to="/drones/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              >
                Add Drone to Matrix
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
          Drones in Matrix
        </h3>
        {matrix.drones.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No drones in this matrix.
          </p>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    Model
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    Position
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    Orientation
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {matrix.drones.map((drone) => (
                  <tr
                    key={drone.id}
                    className={`${
                      selectedDrone?.id === drone.id
                        ? "bg-blue-50 dark:bg-blue-900/30"
                        : ""
                    } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                    onClick={() => setSelectedDrone(drone)}
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-6">
                      {drone.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {drone.model}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      ({drone.x}, {drone.y})
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <DroneDirectionalIcon
                          orientation={drone.orientation}
                          size="sm"
                        />
                        <span className="ml-2">{drone.orientation}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                      <Link
                        to={`/drones/${drone.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Confirm Deletion
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete Matrix {matrix.id}? This action
              cannot be undone.
              {matrix.drones.length > 0 && (
                <span className="block mt-2 font-medium text-red-600 dark:text-red-400">
                  Warning: This matrix contains {matrix.drones.length} drone(s)
                  that will be orphaned.
                </span>
              )}
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatrixDetail;
