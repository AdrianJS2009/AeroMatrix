import type { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import type {
  CreateDroneRequest,
  Drone,
  UpdateDroneRequest,
} from '../models/drone.model';

@Injectable({
  providedIn: 'root',
})
export class DroneService {
  private apiUrl = `${environment.apiUrl}/drones`;

  constructor(private http: HttpClient) {}

  createDrone(drone: CreateDroneRequest): Observable<Drone> {
    return this.http.post<Drone>(this.apiUrl, drone);
  }

  getDrone(droneId: number): Observable<Drone> {
    return this.http.get<Drone>(`${this.apiUrl}/${droneId}`);
  }

  updateDrone(droneId: number, drone: UpdateDroneRequest): Observable<Drone> {
    return this.http.put<Drone>(`${this.apiUrl}/${droneId}`, drone);
  }

  deleteDrone(droneId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${droneId}`);
  }

  listDrones(): Observable<Drone[]> {
    return this.http.get<Drone[]>(this.apiUrl);
  }
}
