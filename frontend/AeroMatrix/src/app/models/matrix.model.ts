import { DroneModel } from './drone.model';

export interface MatrixModel {
  id?: number;
  maxX: number;
  maxY: number;
  drones?: DroneModel[];
}

export interface CreateMatrixRequest {
  maxX: number;
  maxY: number;
}

export interface UpdateMatrixRequest {
  maxX: number;
  maxY: number;
}
