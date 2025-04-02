import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
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
    MultiSelectModule,
    PanelModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <h2 class="mb-4">Control de Vuelos</h2>

    <!-- EJECUTAR COMANDOS A UN DRON -->
    <p-panel header="Un solo dron" toggleable class="mb-4">
      <div class="p-fluid">
        <label>Dron</label>
        <p-dropdown
          [options]="drones"
          [(ngModel)]="selectedDrone"
          optionLabel="name"
          placeholder="Selecciona un dron"
        />

        <label class="mt-2">Comandos</label>
        <input
          type="text"
          pInputText
          [(ngModel)]="commandsText"
          placeholder="Ej: AIAAD"
        />

        <button
          pButton
          label="Ejecutar"
          class="mt-3 p-button-sm"
          (click)="executeSingle()"
          [disabled]="!selectedDrone || !commandsText"
        ></button>
      </div>
    </p-panel>

    <!-- EJECUTAR MISMA SECUENCIA A VARIOS DRONES -->
    <p-panel header="Varios drones - mismos comandos" toggleable class="mb-4">
      <div class="p-fluid">
        <label>Drones</label>
        <p-multiSelect
          [options]="drones"
          [(ngModel)]="multiSelectedDrones"
          optionLabel="name"
          placeholder="Selecciona drones"
        />

        <label class="mt-2">Comandos</label>
        <input
          type="text"
          pInputText
          [(ngModel)]="commandsGroupText"
          placeholder="Ej: DDAIA"
        />

        <button
          pButton
          label="Ejecutar en grupo"
          class="mt-3 p-button-sm"
          (click)="executeGroup()"
          [disabled]="!multiSelectedDrones?.length || !commandsGroupText"
        ></button>
      </div>
    </p-panel>

    <!-- EJECUTAR COMANDOS DISTINTOS A DRONES -->
    <p-panel header="Secuencias distintas por dron" toggleable>
      <div
        *ngFor="let item of batchCommands; let i = index"
        class="mb-3 p-fluid"
      >
        <label>Dron</label>
        <p-dropdown
          [options]="drones"
          [(ngModel)]="item.droneId"
          optionLabel="name"
          placeholder="Selecciona dron"
        />

        <label class="mt-2">Comandos</label>
        <input
          type="text"
          pInputText
          [(ngModel)]="item.commands"
          placeholder="Ej: AAIID"
        />

        <button
          pButton
          icon="pi pi-trash"
          class="p-button-rounded p-button-danger p-button-sm mt-2"
          (click)="batchCommands.splice(i, 1)"
        ></button>
      </div>

      <button
        pButton
        label="Agregar fila"
        icon="pi pi-plus"
        class="p-button-sm me-2"
        (click)="addBatchCommand()"
      ></button>
      <button
        pButton
        label="Ejecutar lote"
        icon="pi pi-play"
        class="p-button-sm"
        (click)="executeBatch()"
        [disabled]="batchCommands.length === 0"
      ></button>
    </p-panel>
  `,
})
export class FlightControlComponent implements OnInit {
  drones: Drone[] = [];

  // Modo 1: individual
  selectedDrone?: Drone;
  commandsText = '';

  // Modo 2: grupo
  multiSelectedDrones: Drone[] = [];
  commandsGroupText = '';

  // Modo 3: lote distinto
  batchCommands: { droneId: number | null; commands: string }[] = [];

  constructor(
    private droneService: DroneService,
    private flightService: FlightService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.droneService.getAll().subscribe((d) => (this.drones = d));
  }

  executeSingle() {
    const commands = this.commandsText.toUpperCase().split('');

    this.flightService
      .sendCommands(this.selectedDrone!.id, commands)
      .subscribe({
        next: (drone) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Comandos ejecutados',
            detail: `Nueva posición: (${drone.x}, ${drone.y})`,
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Falló el vuelo',
          });
        },
      });
  }

  executeGroup() {
    const droneIds = this.multiSelectedDrones.map((d) => d.id);
    const commands = this.commandsGroupText.toUpperCase().split('');

    this.flightService.sendCommandsToMany(droneIds, commands).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Comandos enviados al grupo',
          detail: `Drones: ${droneIds.join(', ')}`,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error en grupo',
          detail: err.error?.message || 'Falló el vuelo',
        });
      },
    });
  }

  addBatchCommand() {
    this.batchCommands.push({ droneId: null, commands: '' });
  }

  executeBatch() {
    const batch = this.batchCommands
      .filter((b) => b.droneId && b.commands)
      .map((b) => ({
        droneId: b.droneId!,
        commands: b.commands.toUpperCase().split(''),
      }));

    if (batch.length === 0) return;

    this.flightService.sendBatchCommands(batch).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Comandos enviados por lote',
          detail: `Total drones: ${batch.length}`,
        });
        this.batchCommands = [];
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error en lote',
          detail: err.error?.message || 'Falló el lote',
        });
      },
    });
  }
}
