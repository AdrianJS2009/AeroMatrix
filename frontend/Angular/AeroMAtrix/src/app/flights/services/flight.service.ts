import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { Drone } from '../../drones/models/drone.model';

/** Interfaces for command requests */
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

  /**
   * Sends commands to a specific drone.
   * @param droneId Drone ID.
   * @param commands Array of commands in string format.
   * @returns Observable emitting the updated drone.
   */
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

  /**
   * Sends the same commands to multiple drones.
   * @param droneIds Drone IDs.
   * @param commands Array of commands.
   * @returns Observable emitting void.
   */
  sendCommandsToMany(droneIds: number[], commands: string[]): Observable<void> {
    const params = new URLSearchParams();
    params.append('droneIds', droneIds.join(','));

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

  /**
   * Sends a batch of commands to different drones.
   * @param batch Array of BatchCommandRequest.
   * @returns Observable emitting void.
   */
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

  /**
   * Private function for error handling.
   *
   * @param error
   * @param consolePrefix
   * @param defaultMessage Default message
   * @returns Error Observable.
   */
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
