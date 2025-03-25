"use client";

import { Grid, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import type { Drone, Matrix } from "../types";

const Dashboard = () => {
  const { getAllDrones, getAllMatrices } = useApi();
  const [drones, setDrones] = useState<Drone[]>([]);
  const [matrices, setMatrices] = useState<Matrix[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dronesData, matricesData] = await Promise.all([
          getAllDrones(),
          getAllMatrices(),
        ]);

        setDrones(dronesData);
        setMatrices(matricesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAllDrones, getAllMatrices]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Drones
            </h2>
            <Link
              to="/drones"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {drones.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No drones available.
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
                        Position
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                      >
                        Matrix
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {drones.slice(0, 5).map((drone) => (
                      <tr
                        key={drone.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-6">
                          <Link
                            to={`/drones/${drone.id}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {drone.name}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          ({drone.x}, {drone.y}) - {drone.orientation}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <Link
                            to={`/matrices/${drone.matrixId}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            Matrix {drone.matrixId}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4">
              <Link
                to="/drones/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Drone
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Matrices
            </h2>
            <div className="flex space-x-4">
              <Link
                to="/matrices"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                View All
              </Link>
              <Link
                to="/matrix-management"
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
              >
                Manage
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {matrices.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No matrices available.
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
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                      >
                        Size
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                      >
                        Drones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {matrices.slice(0, 5).map((matrix) => (
                      <tr
                        key={matrix.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-6">
                          <Link
                            to={`/matrices/${matrix.id}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            Matrix {matrix.id}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {matrix.maxX} x {matrix.maxY}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {matrix.drones.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 flex space-x-4">
              <Link
                to="/matrix/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Matrix
              </Link>
              <Link
                to="/matrix-management"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              >
                <Grid className="mr-2 h-4 w-4" />
                Matrix Management
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Flight Control
          </h2>
          <Link
            to="/flight-control"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            Go to Flight Control
          </Link>
        </div>

        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Control your drones with commands to move them around the matrix.
        </p>

        <Link
          to="/flight-control"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
        >
          Flight Control
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
