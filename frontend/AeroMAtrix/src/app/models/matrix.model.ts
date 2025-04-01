import { Drone } from './drone.model';

export interface Matrix {
  id: number;
  maxX: number;
  maxY: number;
  drones: Drone[];
}
