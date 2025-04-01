import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Drone } from '../models/drone.model';

@Injectable({
  providedIn: 'root',
})
export class DroneService {
  private apiUrl = '/api/drones';

  constructor(private http: HttpClient) {}

  createDrone(drone: any): Observable<Drone> {
    return this.http.post<Drone>(this.apiUrl, drone);
  }

  getDrone(droneId: number): Observable<Drone> {
    return this.http.get<Drone>(`${this.apiUrl}/${droneId}`);
  }

  updateDrone(droneId: number, drone: any): Observable<Drone> {
    return this.http.put<Drone>(`${this.apiUrl}/${droneId}`, drone);
  }

  deleteDrone(droneId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${droneId}`);
  }

  listDrones(): Observable<Drone[]> {
    return this.http.get<Drone[]>(this.apiUrl);
  }
}
