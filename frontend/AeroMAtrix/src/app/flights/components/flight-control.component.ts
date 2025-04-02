import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { Drone } from '../../drones/models/drone.model';
import { DroneService } from '../../drones/services/drone.service';
import { FlightService } from '../services/flight.service';

@Component({
  selector: 'app-flight-control',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <h2 class="mb-3">Control de Vuelos</h2>

    <div class="p-fluid mb-3">
      <label>Dron</label>
      <p-dropdown
        [options]="drones"
        [(ngModel)]="selectedDrone"
        optionLabel="name"
        placeholder="Selecciona un dron"
      />

      <label class="mt-3">Comandos</label>
      <input
        type="text"
        pInputText
        [(ngModel)]="commandsText"
        placeholder="Ej: AIAAD"
      />

      <button
        pButton
        label="Enviar comandos"
        class="mt-3 p-button-sm"
        (click)="executeCommands()"
        [disabled]="!selectedDrone || !commandsText"
      />
    </div>
  `,
})
export class FlightControlComponent implements OnInit {
  drones: Drone[] = [];
  selectedDrone?: Drone;
  commandsText = '';

  constructor(
    private droneService: DroneService,
    private flightService: FlightService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.droneService.getAll().subscribe((d) => (this.drones = d));
  }

  executeCommands() {
    const commands = this.commandsText.toUpperCase().split('');

    this.flightService
      .sendCommands(this.selectedDrone!.id, commands)
      .subscribe({
        next: (updated) => {
          this.messageService.add({
            severity: 'success',
            summary: `Dron actualizado`,
            detail: `Nueva posición: (${updated.x}, ${updated.y})`,
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error en el vuelo',
            detail: err.error?.message || 'Error inesperado',
          });
        },
      });
  }
}
