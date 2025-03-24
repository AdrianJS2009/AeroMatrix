import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ApiProvider } from "./context/ApiContext";
import Dashboard from "./pages/Dashboard";
import DroneDetail from "./pages/DroneDetail";
import DroneList from "./pages/DroneList";
import FlightControl from "./pages/FlightControl";
import MatrixCreate from "./pages/MatrixCreate";
import MatrixDetail from "./pages/MatrixDetail";
import MatrixEdit from "./pages/MatrixEdit";
import MatrixManagement from "./pages/MatrixManagement";

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
              <Route path="/matrices/:id" element={<MatrixDetail />} />
              <Route path="/matrix-management" element={<MatrixManagement />} />
              <Route path="/matrix/create" element={<MatrixCreate />} />
              <Route path="/matrix/edit/:id" element={<MatrixEdit />} />
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
