import { Drone } from '../../drones/models/drone.model';

export interface Matrix {
  id: number;
  maxX: number;
  maxY: number;
  drones: Drone[];
}
