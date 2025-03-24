"use client";

import { Edit, Eye, Grid, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import type { Matrix } from "../types";

const MatrixManagement = () => {
  const { getAllMatrices, deleteMatrix } = useApi();
  const [matrices, setMatrices] = useState<Matrix[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Matrix Management
          </h1>
          <p className="text-gray-500 mt-1">
            Create, view, update, and delete matrices for your drone operations
          </p>
        </div>
        <Link
          to="/matrix/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Matrix
        </Link>
      </div>

      {matrices.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <Grid className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No matrices
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new matrix.
          </p>
          <div className="mt-6">
            <Link
              to="/matrix/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Matrix
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matrices.map((matrix) => (
            <div
              key={matrix.id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Matrix {matrix.id}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {matrix.drones.length}{" "}
                    {matrix.drones.length === 1 ? "drone" : "drones"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Size: {matrix.maxX} x {matrix.maxY}
                </p>

                <div className="mt-4 grid grid-cols-4 gap-2 border border-gray-200 rounded-md p-2 bg-gray-50">
                  {Array.from({ length: Math.min(4, 4) }).map((_, y) => (
                    <div key={y} className="flex">
                      {Array.from({ length: Math.min(4, 4) }).map((_, x) => {
                        const drone = matrix.drones.find(
                          (d) => d.x === x && matrix.maxY - 1 - y === d.y
                        );
                        return (
                          <div
                            key={`${x}-${y}`}
                            className={`w-5 h-5 border border-gray-300 ${
                              drone ? "bg-blue-500" : "bg-white"
                            }`}
                            title={
                              drone
                                ? `Drone: ${drone.name} at (${drone.x}, ${drone.y})`
                                : `Position (${x}, ${matrix.maxY - 1 - y})`
                            }
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="mt-1 text-xs text-gray-500 text-right">
                  Matrix preview (4x4)
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4">
                <div className="flex justify-between">
                  <Link
                    to={`/matrices/${matrix.id}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    View
                  </Link>
                  <Link
                    to={`/matrix/edit/${matrix.id}`}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(matrix.id)}
                    className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation !== null && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Confirm Deletion
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete Matrix {deleteConfirmation}? This
              action cannot be undone.
              {matrices.find((m) => m.id === deleteConfirmation)?.drones
                .length ? (
                <span className="block mt-2 font-medium text-red-600">
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
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
