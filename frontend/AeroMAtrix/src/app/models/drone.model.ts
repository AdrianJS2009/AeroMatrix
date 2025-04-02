export interface Drone {
  id: number;
  name: string;
  model: string;
  x: number;
  y: number;
  orientation: string;
  matrixId: number;
}

export interface CreateDroneRequest {
  name: string;
  model: string;
  x: number;
  y: number;
  orientation: string;
  matrixId: number;
}

export interface UpdateDroneRequest {
  name?: string;
  model?: string;
  x?: number;
  y?: number;
  orientation?: string;
  matrixId?: number;
}
