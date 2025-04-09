import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Drone } from '../models/drone.model';

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

@Injectable({
  providedIn: 'root',
})
export class DroneService {
  private readonly path = '/drones';

  constructor(private readonly apiService: ApiService) {}

  getAll(): Observable<Drone[]> {
    return this.apiService.get<Drone[]>(this.path).pipe(
      catchError((error) => {
        console.error('Error fetching drones:', error);
        return throwError(
          () => new Error('Failed to load drones. Please try again later.')
        );
      })
    );
  }

  getById(id: number): Observable<Drone> {
    return this.apiService.get<Drone>(`${this.path}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching drone ${id}:`, error);
        return throwError(
          () =>
            new Error('Failed to load drone details. Please try again later.')
        );
      })
    );
  }

  create(drone: CreateDroneRequest): Observable<Drone> {
    return this.apiService
      .post<Drone, CreateDroneRequest>(this.path, drone)
      .pipe(
        catchError((error) => {
          console.error('Error creating drone:', error);
          const message =
            error.error?.message ||
            'Failed to create drone. Please check your input and try again.';
          return throwError(() => new Error(message));
        })
      );
  }

  update(id: number, drone: UpdateDroneRequest): Observable<Drone> {
    return this.apiService
      .put<Drone, UpdateDroneRequest>(`${this.path}/${id}`, drone)
      .pipe(
        catchError((error) => {
          console.error(`Error updating drone ${id}:`, error);
          const message =
            error.error?.message ||
            'Failed to update drone. Please check your input and try again.';
          return throwError(() => new Error(message));
        })
      );
  }

  delete(id: number): Observable<any> {
    return this.apiService.delete<any>(`${this.path}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting drone ${id}:`, error);
        return throwError(
          () => new Error('Failed to delete drone. Please try again later.')
        );
      })
    );
  }
}
