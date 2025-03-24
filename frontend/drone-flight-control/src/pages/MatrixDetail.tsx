"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
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
      navigate("/matrices");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!matrix) return;

    if (window.confirm("Are you sure you want to delete this matrix?")) {
      try {
        await deleteMatrix(matrix.id);
        toast.success("Matrix deleted successfully");
        navigate("/matrices");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete matrix"
        );
      }
    }
  };

  const handleSelectDrone = (drone: Drone) => {
    setSelectedDrone(drone);
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
          <h1 className="text-2xl font-bold text-gray-900">Add Matrix</h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {/* MatrixForm component will be imported and used here */}
          <p className="text-gray-500">Matrix form will be displayed here.</p>
        </div>
      </div>
    );
  }

  if (!matrix) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500 mb-4">Matrix not found.</p>
        <Link
          to="/matrices"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Matrices
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Matrix {matrix.id}</h1>
        <div className="flex space-x-3">
          <Link
            to={`/matrices/${matrix.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Matrix Details
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {matrix.id}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Size</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {matrix.maxX} x {matrix.maxY}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Drones</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {matrix.drones.length}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Matrix Grid
        </h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <MatrixGrid
              matrix={matrix}
              selectedDrone={selectedDrone}
              onSelectDrone={handleSelectDrone}
            />
          </div>
          <div className="md:w-1/3">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Selected Drone
              </h4>
              {selectedDrone ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span>{" "}
                    {selectedDrone.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Model:</span>{" "}
                    {selectedDrone.model}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Position:</span> (
                    {selectedDrone.x}, {selectedDrone.y})
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Orientation:</span>{" "}
                    {selectedDrone.orientation}
                  </p>
                  <div className="pt-2">
                    <Link
                      to={`/drones/${selectedDrone.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Drone
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Click on a drone in the grid to select it.
                </p>
              )}
            </div>

            <div className="mt-4">
              <Link
                to="/drones/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Drone to Matrix
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Drones in Matrix
        </h3>
        {matrix.drones.length === 0 ? (
          <p className="text-gray-500">No drones in this matrix.</p>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Model
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Position
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Orientation
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {matrix.drones.map((drone) => (
                  <tr
                    key={drone.id}
                    className={
                      selectedDrone?.id === drone.id ? "bg-blue-50" : ""
                    }
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {drone.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {drone.model}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      ({drone.x}, {drone.y})
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {drone.orientation}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                      <Link
                        to={`/drones/${drone.id}`}
                        className="text-blue-600 hover:text-blue-900"
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
    </div>
  );
};

export default MatrixDetail;
