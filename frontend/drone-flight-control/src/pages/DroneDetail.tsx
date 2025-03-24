"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import CommandInput from "../components/CommandInput";
import DroneDirectionalIcon from "../components/DroneDirectionalIcon";
import DroneForm from "../components/DroneForm";
import MatrixGrid from "../components/MatrixGrid";
import { useApi } from "../context/ApiContext";
import type { Drone, Matrix } from "../types";

const DroneDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getDroneById, deleteDrone, getMatrixById } = useApi();
  const [drone, setDrone] = useState<Drone | null>(null);
  const [matrix, setMatrix] = useState<Matrix | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(
    location.state?.isEditing || false
  );
  const [showOrientationLabels, setShowOrientationLabels] = useState(true);

  useEffect(() => {
    if (id === "new") {
      setLoading(false);
      return;
    }

    fetchDrone();
  }, [id]);

  const fetchDrone = async () => {
    if (!id || id === "new") return;

    try {
      const data = await getDroneById(Number(id));
      setDrone(data);

      const matrixData = await getMatrixById(data.matrixId);
      setMatrix(matrixData);
    } catch (error) {
      toast.error("Failed to fetch drone details");
      navigate("/drones");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!drone) return;

    if (window.confirm("Are you sure you want to delete this drone?")) {
      try {
        await deleteDrone(drone.id);
        toast.success("Drone deleted successfully");
        navigate("/drones");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete drone"
        );
      }
    }
  };

  const handleCommandExecuted = async (updatedDrone: Drone) => {
    setDrone(updatedDrone);

    if (updatedDrone.matrixId) {
      try {
        const matrixData = await getMatrixById(updatedDrone.matrixId);
        setMatrix(matrixData);
      } catch (error) {
        console.error("Failed to refresh matrix data:", error);
      }
    }
  };

  const handleDroneUpdate = (updatedDrone: Drone) => {
    setDrone(updatedDrone);
    setIsEditing(false);

    if (updatedDrone.matrixId !== drone?.matrixId) {
      fetchDrone();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (id === "new") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Add Drone</h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <DroneForm onSubmit={(drone) => navigate(`/drones/${drone.id}`)} />
        </div>
      </div>
    );
  }

  if (!drone) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500 mb-4">Drone not found.</p>
        <Link
          to="/drones"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Drones
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{drone.name}</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Drone</h3>
          <DroneForm drone={drone} onSubmit={handleDroneUpdate} />
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Drone Details
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {drone.id}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {drone.name}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Model</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {drone.model}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Position
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    ({drone.x}, {drone.y})
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Orientation
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                    <DroneDirectionalIcon
                      orientation={drone.orientation}
                      size="md"
                    />
                    <span className="ml-2">{drone.orientation}</span>
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Matrix</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <Link
                      to={`/matrices/${drone.matrixId}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Matrix {drone.matrixId}
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {matrix && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Drone Location
                </h3>
                <div className="flex items-center">
                  <label className="inline-flex items-center mr-4">
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
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                  <MatrixGrid
                    matrix={matrix}
                    selectedDrone={drone}
                    cellSize={36}
                    showCoordinates={true}
                    showOrientationLabels={showOrientationLabels}
                  />
                </div>
                <div className="md:w-1/3">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      Current Status
                    </h4>
                    <div className="flex items-center mb-2">
                      <span className="font-medium mr-2">Orientation:</span>
                      <DroneDirectionalIcon
                        orientation={drone.orientation}
                        size="md"
                        showLabel={true}
                      />
                      <span className="ml-2">{drone.orientation}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Position:</span> ({drone.x},{" "}
                      {drone.y})
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Matrix Size:</span>{" "}
                      {matrix.maxX}x{matrix.maxY}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Control Drone
            </h3>
            <CommandInput
              drone={drone}
              matrix={matrix}
              onCommandExecuted={handleCommandExecuted}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DroneDetail;
