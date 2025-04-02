import { type HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import type { Drone } from '../models/drone.model';
import type {
  BatchDroneCommandRequest,
  CommandsRequest,
} from '../models/flight.model';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private apiUrl = `${environment.apiUrl}/flights`;

  constructor(private http: HttpClient) {}

  // Execute commands on a specific drone
  executeCommands(droneId: number, commands: string[]): Observable<Drone> {
    const request: CommandsRequest = { commands };
    return this.http.post<Drone>(
      `${this.apiUrl}/drones/${droneId}/commands`,
      request
    );
  }

  // Execute the same sequence of commands on multiple drones
  executeCommandsInSequence(
    droneIds: number[],
    commands: string[]
  ): Observable<any> {
    const params = new HttpParams().set('droneIds', droneIds.join(','));
    const request: CommandsRequest = { commands };
    return this.http.post(`${this.apiUrl}/drones/commands`, request, {
      params,
    });
  }

  // Execute batch commands for different drones
  executeBatchCommands(
    batchRequest: BatchDroneCommandRequest
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/batch-commands`, batchRequest);
  }
}
