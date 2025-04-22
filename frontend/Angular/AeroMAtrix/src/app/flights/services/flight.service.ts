import { Injectable } from '@angular/core';
import { type Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
        catchError((error) =>
          this.handleError(
            error,
            `Error sending commands to drone ${droneId}:`,
            'Failed to execute commands. Please try again.'
          )
        )
      );
  }

  sendCommandsToMany(droneIds: number[], commands: string[]): Observable<void> {
    const params = new URLSearchParams();
    droneIds.forEach((id) => params.append('droneIds', id.toString()));

    return this.apiService
      .post<void, CommandsRequest>(
        `${this.path}/drones/commands?${params.toString()}`,
        { commands }
      )
      .pipe(
        catchError((error) =>
          this.handleError(
            error,
            'Error sending commands to multiple drones:',
            'Failed to execute commands on multiple drones. Please try again.'
          )
        )
      );
  }

  sendBatchCommands(batch: BatchCommandRequest[]): Observable<void> {
    return this.apiService
      .post<void, BatchDroneCommandRequest>(`${this.path}/batch-commands`, {
        commands: batch,
      })
      .pipe(
        catchError((error) =>
          this.handleError(
            error,
            'Error sending batch commands:',
            'Failed to execute batch commands. Please try again.'
          )
        )
      );
  }

  private handleError(
    error: any,
    consolePrefix: string,
    defaultMessage: string
  ) {
    console.error(consolePrefix, error);
    const message = error?.error?.message || defaultMessage;
    return throwError(() => new Error(message));
  }
}
