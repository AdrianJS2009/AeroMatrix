import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import type {
  CreateDroneRequest,
  DroneModel,
  UpdateDroneRequest,
} from '../models/drone.model';

@Injectable({
  providedIn: 'root',
})
export class DroneService {
  private readonly apiUrl = `${environment.apiUrl}/drones`;

  constructor(private readonly http: HttpClient) {}

  getDrones(): Observable<DroneModel[]> {
    return this.http.get<DroneModel[]>(this.apiUrl);
  }

  getDrone(id: number): Observable<DroneModel> {
    return this.http.get<DroneModel>(`${this.apiUrl}/${id}`);
  }

  createDrone(drone: CreateDroneRequest): Observable<DroneModel> {
    return this.http.post<DroneModel>(this.apiUrl, drone);
  }

  updateDrone(id: number, drone: UpdateDroneRequest): Observable<DroneModel> {
    return this.http.put<DroneModel>(`${this.apiUrl}/${id}`, drone);
  }

  deleteDrone(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
