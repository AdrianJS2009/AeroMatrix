"use client";

import { useEffect, useState } from "react";
import type { Drone, Matrix, Orientation } from "../types";

interface MatrixGridProps {
  matrix: Matrix;
  selectedDrone?: Drone;
  onSelectDrone?: (drone: Drone) => void;
}

const MatrixGrid = ({
  matrix,
  selectedDrone,
  onSelectDrone,
}: MatrixGridProps) => {
  const [grid, setGrid] = useState<JSX.Element[][]>([]);

  useEffect(() => {
    const createGrid = () => {
      const newGrid: JSX.Element[][] = [];

      // Create grid rows (y-axis, reversed to show 0,0 at bottom left)
      for (let y = matrix.maxY - 1; y >= 0; y--) {
        const row: JSX.Element[] = [];

        // Create grid cells (x-axis)
        for (let x = 0; x < matrix.maxX; x++) {
          // Find drone at this position
          const drone = matrix.drones.find((d) => d.x === x && d.y === y);

          row.push(
            <div
              key={`${x}-${y}`}
              className={`border border-gray-200 flex items-center justify-center w-12 h-12 ${
                drone ? "bg-blue-50 cursor-pointer" : ""
              } ${
                selectedDrone && drone?.id === selectedDrone.id
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
              onClick={() => drone && onSelectDrone && onSelectDrone(drone)}
            >
              {drone && <DroneIcon orientation={drone.orientation} />}
            </div>
          );
        }

        newGrid.push(row);
      }

      setGrid(newGrid);
    };

    createGrid();
  }, [matrix, selectedDrone, onSelectDrone]);

  return (
    <div className="overflow-auto">
      <div className="inline-block border border-gray-300 bg-white">
        {grid.map((row, index) => (
          <div key={index} className="flex">
            {row}
          </div>
        ))}
      </div>
    </div>
  );
};

interface DroneIconProps {
  orientation: Orientation;
}

const DroneIcon = ({ orientation }: DroneIconProps) => {
  const getRotation = () => {
    switch (orientation) {
      case "NORTH":
        return "rotate-0";
      case "EAST":
        return "rotate-90";
      case "SOUTH":
        return "rotate-180";
      case "WEST":
        return "rotate-270";
      default:
        return "rotate-0";
    }
  };

  return (
    <div className={`transform ${getRotation()}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 text-blue-600"
      >
        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
        <path d="M12 7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>
    </div>
  );
};

export default MatrixGrid;
