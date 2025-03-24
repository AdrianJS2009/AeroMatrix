import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ApiProvider } from "./context/ApiContext";
import Dashboard from "./pages/Dashboard";
import DroneDetail from "./pages/DroneDetail";
import DroneList from "./pages/DroneList";
import FlightControl from "./pages/FlightControl";
import MatrixDetail from "./pages/MatrixDetail";
import MatrixList from "./pages/MatrixList";

function App() {
  return (
    <ApiProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/drones" element={<DroneList />} />
              <Route path="/drones/:id" element={<DroneDetail />} />
              <Route path="/matrices" element={<MatrixList />} />
              <Route path="/matrices/:id" element={<MatrixDetail />} />
              <Route path="/flight-control" element={<FlightControl />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </ApiProvider>
  );
}

export default App;
