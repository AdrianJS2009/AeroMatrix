import React, { useEffect, useState } from "react";
import { createDrone, getDrones } from "../services/api";

export default function DroneList() {
  const [drones, setDrones] = useState([]);
  const [newDrone, setNewDrone] = useState({
    matrixId: 1,
    name: "",
    model: "",
    x: 0,
    y: 0,
    orientation: "N",
  });

  useEffect(() => {
    fetchDrones();
  }, []);

  const fetchDrones = async () => {
    const { data } = await getDrones();
    setDrones(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await createDrone(newDrone);
    fetchDrones();
  };

  return (
    <div className="p-4">
      <h2>Drones</h2>
      <form onSubmit={handleCreate} className="mb-4">
        <input
          type="number"
          value={newDrone.matrixId}
          onChange={(e) =>
            setNewDrone({ ...newDrone, matrixId: e.target.value })
          }
          placeholder="Matrix ID"
        />
        <input
          value={newDrone.name}
          onChange={(e) => setNewDrone({ ...newDrone, name: e.target.value })}
          placeholder="Name"
        />
        <input
          value={newDrone.model}
          onChange={(e) => setNewDrone({ ...newDrone, model: e.target.value })}
          placeholder="Model"
        />
        <button type="submit" className="btn btn-primary">
          Create Drone
        </button>
      </form>
      <div className="list-group">
        {drones.map((drone) => (
          <div key={drone.id} className="list-group-item">
            <h5>{drone.name}</h5>
            <p>
              Position: ({drone.x}, {drone.y}) | Facing: {drone.orientation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
