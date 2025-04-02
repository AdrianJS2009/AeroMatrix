import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../enviroments/environment';
import type { Drone } from '../models/drone.model';

@Injectable({ providedIn: 'root' })
export class DroneService {
  private apiUrl = `${environment.apiUrl}/drones`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Drone[]> {
    return this.http.get<Drone[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching drones:', error);
        return throwError(
          () => new Error('Failed to load drones. Please try again later.')
        );
      })
    );
  }

  getById(id: number): Observable<Drone> {
    return this.http.get<Drone>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching drone ${id}:`, error);
        return throwError(
          () =>
            new Error('Failed to load drone details. Please try again later.')
        );
      })
    );
  }

  create(drone: Partial<Drone>): Observable<Drone> {
    return this.http.post<Drone>(this.apiUrl, drone).pipe(
      catchError((error) => {
        console.error('Error creating drone:', error);
        const message =
          error.error?.message ||
          'Failed to create drone. Please check your input and try again.';
        return throwError(() => new Error(message));
      })
    );
  }

  update(id: number, drone: Partial<Drone>): Observable<Drone> {
    return this.http.put<Drone>(`${this.apiUrl}/${id}`, drone).pipe(
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
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting drone ${id}:`, error);
        return throwError(
          () => new Error('Failed to delete drone. Please try again later.')
        );
      })
    );
  }
}
