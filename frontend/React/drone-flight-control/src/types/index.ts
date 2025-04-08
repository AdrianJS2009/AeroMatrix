export type Orientation = "N" | "E" | "S" | "O";

export interface Drone {
  id: number;
  name: string;
  model: string;
  x: number;
  y: number;
  orientation: Orientation;
  matrixId: number;
  camera?: DroneCamera;
}

export interface Matrix {
  id: number;
  maxX: number;
  maxY: number;
  drones: Drone[];
}

export interface CreateDroneRequest {
  name: string;
  model: string;
  x: number;
  y: number;
  orientation: Orientation;
  matrixId: number;
}

export interface UpdateDroneRequest {
  name?: string;
  model?: string;
  x?: number;
  y?: number;
  orientation?: Orientation;
  matrixId?: number;
}

export interface CreateMatrixRequest {
  maxX: number;
  maxY: number;
}

export interface UpdateMatrixRequest {
  maxX: number;
  maxY: number;
}

export interface CommandsRequest {
  commands: string;
}

export interface BatchDroneCommand {
  droneId: number;
  commands: string;
}

export interface BatchDroneCommandRequest {
  commands: BatchDroneCommand[];
}

export interface DroneConfiguration {
  id: string;
  name: string;
  drones: Drone[];
  commands: Record<number, string>;
  createdAt: string;
  maxSpeed?: number;
  maxAltitude?: number;
  defaultOrientation?: Orientation;
  cameraSettings?: DroneCamera;
}

export interface SavedConfiguration {
  id: string;
  name: string;
  date: string;
  configuration: DroneConfiguration;
}

export interface DroneStatus {
  batteryLevel: number;
  signalStrength: number;
  isFlying: boolean;
  altitude: number;
  speed: number;
  temperature: number;
  lastUpdated: string;
}

export interface DroneCamera {
  angle: number;
  zoom: number;
  isRecording: boolean;
  resolution: string;
}

export interface CameraAction {
  type:
    | "ADJUST_ANGLE"
    | "ADJUST_ZOOM"
    | "START_RECORDING"
    | "STOP_RECORDING"
    | "TAKE_PHOTO";
  value?: number;
}

export interface DroneAction {
  type: "TAKEOFF" | "LAND" | "HOVER" | "RETURN_HOME" | "EMERGENCY_STOP";
  altitude?: number;
  speed?: number;
}
