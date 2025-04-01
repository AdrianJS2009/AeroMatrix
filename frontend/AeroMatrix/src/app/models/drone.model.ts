export interface DroneModel {
  id?: number;
  name: string;
  model: string;
  x: number;
  y: number;
  orientation: Orientation;
  matrixId: number;
}

export enum Orientation {
  NORTH = 'NORTH',
  EAST = 'EAST',
  SOUTH = 'SOUTH',
  WEST = 'WEST',
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
