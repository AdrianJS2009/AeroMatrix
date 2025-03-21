import React from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CommandForm from "./components/CommandForm";
import CreateDroneForm from "./components/CreateDroneForm"; // Asegúrate de tener esta importación
import DroneList from "./components/DroneList";
import MatrixGrid from "./components/MatrixGrid";
import MatrixList from "./components/MatrixList";

export default function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">
          Drone Control
        </Link>
        <div className="navbar-nav">
          <Link className="nav-item nav-link" to="/matrices">
            Matrices
          </Link>
          <Link className="nav-item nav-link" to="/drones">
            Drones
          </Link>
          <Link className="nav-item nav-link" to="/drones/create">
            Create Drone
          </Link>
        </div>
      </nav>

      <div className="container">
        <Routes>
          {/* Rutas principales */}
          <Route path="/matrices" element={<MatrixList />} />
          <Route path="/drones" element={<DroneList />} />
          <Route path="/drones/create" element={<CreateDroneForm />} />

          {/* Rutas con parámetros */}
          <Route path="/commands/:droneId" element={<CommandForm />} />
          <Route path="/matrix-view/:matrixId" element={<MatrixGrid />} />
        </Routes>
      </div>
    </Router>
  );
}
