export type Orientation = "NORTH" | "EAST" | "SOUTH" | "WEST";

export interface Drone {
  id: number;
  name: string;
  model: string;
  x: number;
  y: number;
  orientation: Orientation;
  matrixId: number;
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
