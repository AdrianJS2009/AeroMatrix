import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../enviroments/environment';
import type { Drone } from '../../drones/models/drone.model';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private apiUrl = `${environment.apiUrl}/flights`;

  constructor(private http: HttpClient) {}

  sendCommands(droneId: number, commands: string[]): Observable<Drone> {
    return this.http
      .post<Drone>(`${this.apiUrl}/drones/${droneId}/commands`, {
        commands,
      })
      .pipe(
        catchError((error) => {
          console.error(`Error sending commands to drone ${droneId}:`, error);
          const message =
            error.error?.message ||
            'Failed to execute commands. Please try again.';
          return throwError(() => new Error(message));
        })
      );
  }

  sendCommandsToMany(droneIds: number[], commands: string[]): Observable<void> {
    return this.http
      .post<void>(
        `${this.apiUrl}/drones/commands`,
        { commands },
        {
          params: { droneIds: droneIds.join(',') },
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Error sending commands to multiple drones:', error);
          const message =
            error.error?.message ||
            'Failed to execute commands on multiple drones. Please try again.';
          return throwError(() => new Error(message));
        })
      );
  }

  sendBatchCommands(
    batch: { droneId: number; commands: string[] }[]
  ): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/batch-commands`, {
        commands: batch,
      })
      .pipe(
        catchError((error) => {
          console.error('Error sending batch commands:', error);
          const message =
            error.error?.message ||
            'Failed to execute batch commands. Please try again.';
          return throwError(() => new Error(message));
        })
      );
  }
}
