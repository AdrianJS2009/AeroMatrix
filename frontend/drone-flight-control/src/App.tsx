import { Toaster } from "react-hot-toast";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ApiProvider } from "./context/ApiContext";
import { ThemeProvider } from "./context/ThemeContext";
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
      <ThemeProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Navbar />
            <main className="container mx-auto px-4 py-8 flex-grow">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/drones" element={<DroneList />} />
                <Route path="/drones/:id" element={<DroneDetail />} />
                <Route
                  path="/matrices"
                  element={<Navigate to="/matrix-management" replace />}
                />
                <Route path="/matrices/:id" element={<MatrixDetail />} />
                <Route
                  path="/matrix-management"
                  element={<MatrixManagement />}
                />
                <Route path="/matrix/create" element={<MatrixCreate />} />
                <Route path="/matrix/edit/:id" element={<MatrixEdit />} />
                <Route path="/flight-control" element={<FlightControl />} />
              </Routes>
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "var(--toast-background, #fff)",
                  color: "var(--toast-text, #333)",
                  boxShadow:
                    "var(--toast-shadow, 0 3px 10px rgba(0, 0, 0, 0.1))",
                },
              }}
            />
          </div>
        </Router>
      </ThemeProvider>
    </ApiProvider>
  );
}

export default App;
