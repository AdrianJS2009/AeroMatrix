import axios from "axios";
import React, { useState } from "react";

const CreateDroneForm = () => {
  const [formData, setFormData] = useState({
    matrixId: 1,
    name: "",
    model: "",
    x: 0,
    y: 0,
    orientation: "N",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/drones", // URL completa del endpoint
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(`¡Dron creado! ID: ${response.data.id}`);
      setFormData({
        // Resetear formulario
        matrixId: 1,
        name: "",
        model: "",
        x: 0,
        y: 0,
        orientation: "N",
      });
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Drone</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Matrix ID:</label>
          <input
            type="number"
            className="form-control"
            value={formData.matrixId}
            onChange={(e) =>
              setFormData({ ...formData, matrixId: e.target.value })
            }
          />
        </div>

        <div className="mb-3">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        {/* Repetir para model, x, y y orientation */}

        <button type="submit" className="btn btn-primary">
          Create Drone
        </button>
      </form>

      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </div>
  );
};

export default CreateDroneForm;
