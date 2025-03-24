"use client";

import { useMemo } from "react";
import type { Drone, Matrix } from "../types";
import DroneDirectionalIcon from "./DroneDirectionalIcon";

interface MatrixGridProps {
  matrix: Matrix;
  selectedDrone?: Drone | null;
  onSelectDrone?: (drone: Drone) => void;
  highlightedCells?: { x: number; y: number }[];
  cellSize?: number;
  showCoordinates?: boolean;
  interactive?: boolean;
  showOrientationLabels?: boolean;
}

const MatrixGrid = ({
  matrix,
  selectedDrone,
  onSelectDrone,
  highlightedCells = [],
  cellSize = 12,
  showCoordinates = false,
  interactive = true,
  showOrientationLabels = false,
}: MatrixGridProps) => {
  const grid = useMemo(() => {
    const newGrid: JSX.Element[][] = [];

    for (let y = matrix.maxY - 1; y >= 0; y--) {
      const row: JSX.Element[] = [];

      for (let x = 0; x < matrix.maxX; x++) {
        const drone = matrix.drones.find((d) => d.x === x && d.y === y);
        const isHighlighted = highlightedCells.some(
          (cell) => cell.x === x && cell.y === y
        );

        row.push(
          <div
            key={`${x}-${y}`}
            className={`border border-gray-200 flex items-center justify-center ${
              drone ? "bg-blue-50 cursor-pointer" : ""
            } ${
              selectedDrone && drone?.id === selectedDrone.id
                ? "ring-2 ring-blue-500"
                : ""
            } ${isHighlighted ? "bg-yellow-100" : ""} ${
              interactive ? "hover:bg-gray-50" : ""
            }`}
            style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
            onClick={() =>
              interactive && drone && onSelectDrone && onSelectDrone(drone)
            }
            title={`Position: (${x}, ${y})${
              drone ? ` - Drone: ${drone.name} (${drone.orientation})` : ""
            }`}
          >
            {drone && (
              <DroneDirectionalIcon
                orientation={drone.orientation}
                size={cellSize >= 32 ? "lg" : cellSize >= 24 ? "md" : "sm"}
                showLabel={showOrientationLabels}
              />
            )}
            {showCoordinates && !drone && (
              <span className="text-[8px] text-gray-400">
                {x},{y}
              </span>
            )}
          </div>
        );
      }
      newGrid.push(row);
    }
    return newGrid;
  }, [
    matrix.maxX,
    matrix.maxY,
    matrix.drones,
    selectedDrone,
    highlightedCells,
    cellSize,
    interactive,
    showCoordinates,
    showOrientationLabels,
    onSelectDrone,
  ]);

  return (
    <div className="space-y-4">
      <div className="overflow-auto">
        <div className="inline-block border border-gray-300 bg-white">
          {grid.map((row, index) => (
            <div key={index} className="flex">
              {row}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <div>Origin (0,0) is at bottom-left</div>
        <div>
          Width: {matrix.maxX}, Height: {matrix.maxY}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <DroneDirectionalIcon orientation="NORTH" size="sm" />
          <span className="text-xs text-gray-600">North</span>
        </div>
        <div className="flex items-center gap-2">
          <DroneDirectionalIcon orientation="EAST" size="sm" />
          <span className="text-xs text-gray-600">East</span>
        </div>
        <div className="flex items-center gap-2">
          <DroneDirectionalIcon orientation="SOUTH" size="sm" />
          <span className="text-xs text-gray-600">South</span>
        </div>
        <div className="flex items-center gap-2">
          <DroneDirectionalIcon orientation="WEST" size="sm" />
          <span className="text-xs text-gray-600">West</span>
        </div>
      </div>
    </div>
  );
};

export default MatrixGrid;
