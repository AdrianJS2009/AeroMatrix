import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import type {
  CreateDroneRequest,
  DroneModel,
  UpdateDroneRequest,
} from '../models/drone.model';
import type { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class DroneService {
  private apiUrl = `${environment.apiUrl}/drones`;

  constructor(private httpClient: HttpClientService) {}

  getDrones(): Observable<DroneModel[]> {
    return this.httpClient.get<DroneModel[]>(this.apiUrl);
  }

  getDrone(id: number): Observable<DroneModel> {
    return this.httpClient.get<DroneModel>(`${this.apiUrl}/${id}`);
  }

  createDrone(drone: CreateDroneRequest): Observable<DroneModel> {
    return this.httpClient.post<DroneModel>(this.apiUrl, drone);
  }

  updateDrone(id: number, drone: UpdateDroneRequest): Observable<DroneModel> {
    return this.httpClient.put<DroneModel>(`${this.apiUrl}/${id}`, drone);
  }

  deleteDrone(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
}
