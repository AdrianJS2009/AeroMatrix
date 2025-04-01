import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import type { DroneModel } from '../models/drone.model';
import type {
  BatchDroneCommandRequest,
  CommandsRequest,
} from '../models/flight.model';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private readonly apiUrl = `${environment.apiUrl}/flights`;

  constructor(private readonly http: HttpClient) {}

  executeCommands(droneId: number, commands: string): Observable<DroneModel> {
    const request: CommandsRequest = { commands };
    return this.http.post<DroneModel>(
      `${this.apiUrl}/drones/${droneId}/commands`,
      request
    );
  }

  executeCommandsInSequence(
    droneIds: number[],
    commands: string
  ): Observable<void> {
    const request: CommandsRequest = { commands };
    return this.http.post<void>(
      `${this.apiUrl}/drones/commands?droneIds=${droneIds.join(',')}`,
      request
    );
  }

  executeBatchCommands(
    batchRequest: BatchDroneCommandRequest
  ): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/batch-commands`, batchRequest);
  }
}
