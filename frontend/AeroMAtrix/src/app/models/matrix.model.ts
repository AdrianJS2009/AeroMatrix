import { Drone } from './drone.model';

export interface Matrix {
  id: number;
  maxX: number;
  maxY: number;
  drones: Drone[];
}
export interface Matrix {
  id: number;
  maxX: number;
  maxY: number;
  drones: Drone[];
}

export interface CreateMatrixRequest {
  maxX: number;
  maxY: number;
}

export interface UpdateMatrixRequest {
  maxX: number;
  maxY: number;
}
