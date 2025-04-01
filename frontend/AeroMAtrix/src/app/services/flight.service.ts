import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Drone } from '../models/drone.model';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private apiUrl = '/api/flights';

  constructor(private http: HttpClient) {}

  // Ejecuta comandos en un dron específico
  executeCommands(droneId: number, commands: string[]): Observable<Drone> {
    return this.http.post<Drone>(`${this.apiUrl}/drones/${droneId}/commands`, {
      commands,
    });
  }

  // Ejecuta la misma secuencia de comandos en múltiples drones
  executeCommandsInSequence(
    droneIds: number[],
    commands: string[]
  ): Observable<any> {
    // Se envían los IDs en formato CSV como parámetro
    const params = new HttpParams().set('droneIds', droneIds.join(','));
    return this.http.post(
      `${this.apiUrl}/drones/commands`,
      { commands },
      { params }
    );
  }

  // Ejecuta comandos batch para distintos drones
  executeBatchCommands(batch: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/batch-commands`, batch);
  }
}
