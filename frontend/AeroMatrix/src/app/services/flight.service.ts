import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import type { DroneModel } from '../models/drone.model';
import type {
  BatchDroneCommandRequest,
  CommandsRequest,
} from '../models/flight.model';
import type { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private apiUrl = `${environment.apiUrl}/flights`;

  constructor(private httpClient: HttpClientService) {}

  executeCommands(droneId: number, commands: string): Observable<DroneModel> {
    const request: CommandsRequest = { commands };
    return this.httpClient.post<DroneModel>(
      `${this.apiUrl}/drones/${droneId}/commands`,
      request
    );
  }

  executeCommandsInSequence(
    droneIds: number[],
    commands: string
  ): Observable<void> {
    const request: CommandsRequest = { commands };
    return this.httpClient.post<void>(
      `${this.apiUrl}/drones/commands?droneIds=${droneIds.join(',')}`,
      request
    );
  }

  executeBatchCommands(
    batchRequest: BatchDroneCommandRequest
  ): Observable<void> {
    return this.httpClient.post<void>(
      `${this.apiUrl}/batch-commands`,
      batchRequest
    );
  }
}
