import { Injectable } from '@angular/core';
import { type Observable, catchError, throwError } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Drone } from '../../drones/models/drone.model';

export interface CommandsRequest {
  commands: string[];
}

export interface BatchCommandRequest {
  droneId: number;
  commands: string[];
}

export interface BatchDroneCommandRequest {
  commands: BatchCommandRequest[];
}

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private readonly path = '/flights';

  constructor(private readonly apiService: ApiService) {}

  sendCommands(droneId: number, commands: string[]): Observable<Drone> {
    return this.apiService
      .post<Drone, CommandsRequest>(`${this.path}/drones/${droneId}/commands`, {
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
    const params = new URLSearchParams();
    params.append('droneIds', droneIds.join(','));

    return this.apiService
      .post<void, CommandsRequest>(
        `${this.path}/drones/commands?${params.toString()}`,
        { commands }
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

  sendBatchCommands(batch: BatchCommandRequest[]): Observable<void> {
    return this.apiService
      .post<void, BatchDroneCommandRequest>(`${this.path}/batch-commands`, {
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
