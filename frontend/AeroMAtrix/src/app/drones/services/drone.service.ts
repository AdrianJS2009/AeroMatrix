import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Drone } from '../models/drone.model';

@Injectable({ providedIn: 'root' })
export class DroneService {
  private apiUrl = 'http://localhost:8080/api/drones';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Drone[]> {
    return this.http.get<Drone[]>(this.apiUrl);
  }

  getById(id: number): Observable<Drone> {
    return this.http.get<Drone>(`${this.apiUrl}/${id}`);
  }

  create(drone: Partial<Drone>): Observable<Drone> {
    return this.http.post<Drone>(this.apiUrl, drone);
  }

  update(id: number, drone: Partial<Drone>): Observable<Drone> {
    return this.http.put<Drone>(`${this.apiUrl}/${id}`, drone);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
