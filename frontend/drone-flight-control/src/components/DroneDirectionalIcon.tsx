import type React from "react";
import type { Orientation } from "../types";

interface DroneDirectionalIconProps {
  orientation: Orientation;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const DroneDirectionalIcon: React.FC<DroneDirectionalIconProps> = ({
  orientation,
  size = "md",
  showLabel = false,
}) => {
  const sizeMap = {
    sm: { width: 16, height: 16, fontSize: 6 },
    md: { width: 24, height: 24, fontSize: 8 },
    lg: { width: 32, height: 32, fontSize: 10 },
  };

  const { width, height, fontSize } = sizeMap[size];

  const getOrientationColor = () => {
    switch (orientation) {
      case "N":
        return "#34D399"; // green
      case "E":
        return "#60A5FA"; // blue
      case "S":
        return "#F87171"; // red
      case "O":
        return "#FBBF24"; // yellow
      default:
        return "#60A5FA"; // default blue
    }
  };

  const getRotationAngle = () => {
    switch (orientation) {
      case "N":
        return 0;
      case "E":
        return 90;
      case "S":
        return 180;
      case "O":
        return 270;
      default:
        return 0;
    }
  };

  const getOrientationLabel = () => {
    switch (orientation) {
      case "N":
        return "N";
      case "E":
        return "E";
      case "S":
        return "S";
      case "O":
        return "O"; // o podrías mostrar "W" si prefieres representar "Oeste" con la W
      default:
        return "?";
    }
  };

  return (
    <div className="relative" style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `rotate(${getRotationAngle()}deg)`,
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {/* Drone body */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill={getOrientationColor()}
          opacity="0.2"
        />
        <circle cx="12" cy="12" r="6" fill={getOrientationColor()} />
        {/* Direction indicator */}
        <path
          d="M12 2L16 8H8L12 2Z"
          fill={getOrientationColor()}
          stroke="white"
          strokeWidth="1"
        />
      </svg>

      {showLabel && (
        <div
          className="absolute inset-0 flex items-center justify-center text-white font-bold"
          style={{ fontSize }}
        >
          {getOrientationLabel()}
        </div>
      )}
    </div>
  );
};

export default DroneDirectionalIcon;
