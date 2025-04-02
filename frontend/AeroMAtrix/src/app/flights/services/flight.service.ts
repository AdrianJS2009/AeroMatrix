import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Drone } from '../../drones/models/drone.model';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private apiUrl = 'http://localhost:8080/api/flights';

  constructor(private http: HttpClient) {}

  sendCommands(droneId: number, commands: string[]): Observable<Drone> {
    return this.http.post<Drone>(`${this.apiUrl}/drones/${droneId}/commands`, {
      commands,
    });
  }

  sendCommandsToMany(droneIds: number[], commands: string[]): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/drones/commands`,
      { commands },
      {
        params: { droneIds: droneIds.join(',') },
      }
    );
  }

  sendBatchCommands(
    batch: { droneId: number; commands: string[] }[]
  ): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/batch-commands`, {
      commands: batch,
    });
  }
}
