import React from "react";

export default function MatrixGrid({ matrix, drones }) {
  const grid = Array(matrix.maxY + 1)
    .fill()
    .map(() =>
      Array(matrix.maxX + 1)
        .fill()
        .map(() => [])
    );

  drones.forEach((drone) => {
    if (drone.x <= matrix.maxX && drone.y <= matrix.maxY) {
      grid[drone.y][drone.x].push(drone);
    }
  });

  return (
    <div className="matrix-grid">
      {grid.map((row, y) => (
        <div key={y} className="matrix-row">
          {row.map((cell, x) => (
            <div key={x} className="matrix-cell">
              {cell.map((drone) => (
                <div
                  key={drone.id}
                  className="drone"
                  title={`Drone ${drone.name}`}
                >
                  {drone.orientation}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
