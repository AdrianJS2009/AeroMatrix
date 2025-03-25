"use client";

import {
  Edit,
  Eye,
  Grid,
  PlusCircle,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import DroneDirectionalIcon from "../components/DroneDirectionalIcon";
import { useApi } from "../context/ApiContext";
import type { Matrix } from "../types";

const MatrixManagement = () => {
  const { getAllMatrices, deleteMatrix } = useApi();
  const [matrices, setMatrices] = useState<Matrix[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Matrix>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchMatrices();
  }, []);

  const fetchMatrices = async () => {
    setLoading(true);
    try {
      const data = await getAllMatrices();
      setMatrices(data);
    } catch (error) {
      toast.error("Failed to fetch matrices");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirmation(id);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation === null) return;

    try {
      await deleteMatrix(deleteConfirmation);
      toast.success("Matrix deleted successfully");
      fetchMatrices();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete matrix"
      );
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation(null);
  };

  const handleSort = (field: keyof Matrix) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof Matrix) => {
    if (field !== sortField) return null;

    return sortDirection === "asc" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 inline-block ml-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 inline-block ml-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  const filteredMatrices = matrices
    .filter(
      (matrix) =>
        searchTerm === "" ||
        matrix.id.toString().includes(searchTerm) ||
        `${matrix.maxX}x${matrix.maxY}`.includes(searchTerm)
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Fallback for non-numeric fields
      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Matrix Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Create, view, update, and delete matrices for your drone operations
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search matrices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600"
              }`}
              aria-label="Grid view"
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600"
              }`}
              aria-label="List view"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <button
              onClick={fetchMatrices}
              className="p-2 rounded-md bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              aria-label="Refresh"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          <Link
            to="/matrix/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Matrix
          </Link>
        </div>
      </div>

      {matrices.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
          <Grid className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No matrices
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new matrix.
          </p>
          <div className="mt-6">
            <Link
              to="/matrix/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Matrix
            </Link>
          </div>
        </div>
      ) : filteredMatrices.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No results found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            No matrices match your search criteria. Try adjusting your search or
            clear it to see all matrices.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setSearchTerm("")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            >
              Clear Search
            </button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMatrices.map((matrix) => (
            <div
              key={matrix.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Matrix {matrix.id}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                    {matrix.drones.length}{" "}
                    {matrix.drones.length === 1 ? "drone" : "drones"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Size: {matrix.maxX} x {matrix.maxY}
                </p>

                <div className="mt-4 grid grid-cols-4 gap-1 border border-gray-200 dark:border-gray-700 rounded-md p-2 bg-gray-50 dark:bg-gray-900">
                  {Array.from({ length: Math.min(4, 4) }).map((_, y) => (
                    <div key={y} className="flex">
                      {Array.from({ length: Math.min(4, 4) }).map((_, x) => {
                        const drone = matrix.drones.find(
                          (d) => d.x === x && matrix.maxY - 1 - y === d.y
                        );
                        return (
                          <div
                            key={`${x}-${y}`}
                            className={`w-5 h-5 border ${
                              drone
                                ? "border-blue-600 dark:border-blue-500 bg-blue-500 dark:bg-blue-600"
                                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                            }`}
                            title={
                              drone
                                ? `Drone: ${drone.name} at (${drone.x}, ${drone.y})`
                                : `Position (${x}, ${matrix.maxY - 1 - y})`
                            }
                          >
                            {drone && (
                              <div className="flex items-center justify-center w-full h-full">
                                <DroneDirectionalIcon
                                  orientation={drone.orientation}
                                  size="sm"
                                  showLabel={false}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                  Matrix preview (4x4)
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                <div className="flex justify-between">
                  <Link
                    to={`/matrices/${matrix.id}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    View
                  </Link>
                  <Link
                    to={`/matrix/edit/${matrix.id}`}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(matrix.id)}
                    className="inline-flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  ID {getSortIcon("id")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("maxX")}
                >
                  Size {getSortIcon("maxX")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Drones
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMatrices.map((matrix) => (
                <tr
                  key={matrix.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      <Link
                        to={`/matrices/${matrix.id}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Matrix {matrix.id}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {matrix.maxX} x {matrix.maxY}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {matrix.drones.length}
                      {matrix.drones.length > 0 && (
                        <span className="ml-2 inline-flex items-center">
                          {matrix.drones.slice(0, 3).map((drone) => (
                            <span
                              key={drone.id}
                              className="mr-1"
                              title={`${drone.name} (${drone.x}, ${drone.y})`}
                            >
                              <DroneDirectionalIcon
                                orientation={drone.orientation}
                                size="sm"
                              />
                            </span>
                          ))}
                          {matrix.drones.length > 3 && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              +{matrix.drones.length - 3} more
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/matrices/${matrix.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                    >
                      View
                    </Link>
                    <Link
                      to={`/matrix/edit/${matrix.id}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(matrix.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteConfirmation !== null && (
        <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Confirm Deletion
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete Matrix {deleteConfirmation}? This
              action cannot be undone.
              {matrices.find((m) => m.id === deleteConfirmation)?.drones
                .length ? (
                <span className="block mt-2 font-medium text-red-600 dark:text-red-400">
                  Warning: This matrix contains{" "}
                  {
                    matrices.find((m) => m.id === deleteConfirmation)?.drones
                      .length
                  }{" "}
                  drones that will be orphaned.
                </span>
              ) : null}
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
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

export default MatrixManagement;
