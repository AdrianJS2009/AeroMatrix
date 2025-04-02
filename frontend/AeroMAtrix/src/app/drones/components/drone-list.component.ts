import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Drone } from '../models/drone.model';
import { DroneService } from '../services/drone.service';
import { DroneFormComponent } from './drone-form.component';

@Component({
  standalone: true,
  selector: 'app-drone-list',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    DroneFormComponent,
  ],
  providers: [MessageService],
  template: `
    <div class="flex justify-between items-center mb-3">
      <h2>Drones</h2>
      <button
        pButton
        icon="pi pi-plus"
        label="Nuevo"
        (click)="openForm()"
        class="p-button-sm"
      />
    </div>

    <p-table
      [value]="drones"
      [paginator]="true"
      [rows]="10"
      [responsiveLayout]="'scroll'"
    >
      <ng-template pTemplate="header">
        <tr>
          <th>Nombre</th>
          <th>Modelo</th>
          <th>Posición</th>
          <th>Orientación</th>
          <th>Matriz</th>
          <th>Acciones</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-drone>
        <tr>
          <td>{{ drone.name }}</td>
          <td>{{ drone.model }}</td>
          <td>({{ drone.x }}, {{ drone.y }})</td>
          <td>{{ drone.orientation }}</td>
          <td>{{ drone.matrixId }}</td>
          <td>
            <button
              pButton
              icon="pi pi-pencil"
              class="p-button-rounded p-button-text p-button-sm me-1"
              (click)="openForm(drone)"
            />
            <button
              pButton
              icon="pi pi-trash"
              class="p-button-rounded p-button-text p-button-sm p-button-danger"
              (click)="deleteDrone(drone.id)"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>

    <app-drone-form
      [visible]="formVisible"
      [droneToEdit]="selectedDrone"
      (saved)="loadDrones()"
      (close)="closeForm()"
    />
  `,
})
export class DroneListComponent implements OnInit {
  drones: Drone[] = [];
  formVisible = false;
  selectedDrone?: Drone;

  constructor(
    private droneService: DroneService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDrones();
  }

  loadDrones() {
    this.droneService.getAll().subscribe({
      next: (data) => (this.drones = data),
      error: (err) =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los drones',
        }),
    });
  }

  deleteDrone(id: number) {
    this.droneService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Dron eliminado',
          detail: `ID ${id}`,
        });
        this.loadDrones();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al eliminar',
          detail: err.error?.message || 'Error inesperado',
        });
      },
    });
  }

  openForm(drone?: Drone) {
    this.selectedDrone = drone;
    this.formVisible = true;
  }

  closeForm() {
    this.selectedDrone = undefined;
    this.formVisible = false;
  }
}
