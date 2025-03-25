"use client";

import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const location = useLocation();
  const { theme } = useTheme();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="text-xl font-bold text-blue-600 dark:text-blue-400"
              >
                Drone Flight Control
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/")
                    ? "border-blue-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/drones"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/drones")
                    ? "border-blue-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Drones
              </Link>
              <Link
                to="/matrix-management"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/matrix-management")
                    ? "border-blue-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Matrix Management
              </Link>
              <Link
                to="/flight-control"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/flight-control")
                    ? "border-blue-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Flight Control
              </Link>
            </div>
          </div>

          <div className="hidden sm:flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* ############# Mobile version ############ */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/")
                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/drones"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/drones")
                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            Drones
          </Link>
          <Link
            to="/matrix-management"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/matrix-management")
                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            Matrix Management
          </Link>
          <Link
            to="/flight-control"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/flight-control")
                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            Flight Control
          </Link>

          <div className="pl-3 pr-4 py-2 flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
