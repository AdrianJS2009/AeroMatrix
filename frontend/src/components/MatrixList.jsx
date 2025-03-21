import React, { useEffect, useState } from "react";
import { createMatrix, deleteMatrix, getMatrices } from "../services/api";

export default function MatrixList() {
  const [matrices, setMatrices] = useState([]);
  const [newMatrix, setNewMatrix] = useState({ maxX: 5, maxY: 5 });

  useEffect(() => {
    fetchMatrices();
  }, []);

  const fetchMatrices = async () => {
    const { data } = await getMatrices();
    setMatrices(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await createMatrix(newMatrix);
    fetchMatrices();
  };

  return (
    <div className="p-4">
      <h2>Flight Matrices</h2>
      <form onSubmit={handleCreate} className="mb-4">
        <input
          type="number"
          value={newMatrix.maxX}
          onChange={(e) => setNewMatrix({ ...newMatrix, maxX: e.target.value })}
          placeholder="Max X"
        />
        <input
          type="number"
          value={newMatrix.maxY}
          onChange={(e) => setNewMatrix({ ...newMatrix, maxY: e.target.value })}
          placeholder="Max Y"
        />
        <button type="submit" className="btn btn-primary">
          Create Matrix
        </button>
      </form>
      <div className="list-group">
        {matrices.map((matrix) => (
          <div key={matrix.id} className="list-group-item">
            <h5>Matrix {matrix.id}</h5>
            <p>
              Size: {matrix.maxX}x{matrix.maxY}
            </p>
            <button
              onClick={() => deleteMatrix(matrix.id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
