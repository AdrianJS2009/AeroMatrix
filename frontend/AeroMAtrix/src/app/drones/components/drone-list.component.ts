import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
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
    ConfirmDialogModule,
    CardModule,
    TagModule,
    SkeletonModule,
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-card>
      <div class="flex justify-content-between align-items-center mb-3">
        <h2 class="m-0">Drones</h2>
        <button
          pButton
          icon="pi pi-plus"
          label="Nuevo Dron"
          (click)="openForm()"
          class="p-button-sm"
        ></button>
      </div>

      <p-table
        [value]="drones"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[5, 10, 25]"
        [loading]="loading"
        styleClass="p-datatable-sm p-datatable-gridlines"
        [tableStyle]="{ 'min-width': '50rem' }"
        responsiveLayout="scroll"
      >
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="id">
              ID <p-sortIcon field="id"></p-sortIcon>
            </th>
            <th pSortableColumn="name">
              Nombre <p-sortIcon field="name"></p-sortIcon>
            </th>
            <th pSortableColumn="model">
              Modelo <p-sortIcon field="model"></p-sortIcon>
            </th>
            <th>Posición</th>
            <th>Orientación</th>
            <th pSortableColumn="matrixId">
              Matriz <p-sortIcon field="matrixId"></p-sortIcon>
            </th>
            <th style="width: 8rem">Acciones</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-drone>
          <tr>
            <td>{{ drone.id }}</td>
            <td>{{ drone.name }}</td>
            <td>{{ drone.model }}</td>
            <td>
              <p-tag
                [value]="'(' + drone.x + ', ' + drone.y + ')'"
                [rounded]="true"
                severity="info"
              ></p-tag>
            </td>
            <td>
              <p-tag
                [value]="drone.orientation"
                [rounded]="true"
                severity="success"
              ></p-tag>
            </td>
            <td>{{ drone.matrixId }}</td>
            <td>
              <div class="flex gap-2 justify-content-center">
                <button
                  pButton
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text p-button-sm"
                  (click)="openForm(drone)"
                  pTooltip="Editar"
                ></button>
                <button
                  pButton
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-sm p-button-danger"
                  (click)="confirmDelete(drone)"
                  pTooltip="Eliminar"
                ></button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" class="text-center p-4">
              <div *ngIf="loading" class="flex flex-column align-items-center">
                <p-skeleton
                  height="2rem"
                  styleClass="mb-2"
                  width="20rem"
                ></p-skeleton>
                <p-skeleton
                  height="2rem"
                  styleClass="mb-2"
                  width="15rem"
                ></p-skeleton>
                <p-skeleton height="2rem" width="10rem"></p-skeleton>
              </div>
              <div *ngIf="!loading">
                No se encontraron drones. Crea uno nuevo para comenzar.
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>

    <app-drone-form
      [visible]="formVisible"
      [droneToEdit]="selectedDrone"
      (saved)="loadDrones()"
      (close)="closeForm()"
    />

    <p-confirmDialog
      header="Confirmar Eliminación"
      icon="pi pi-exclamation-triangle"
      acceptLabel="Sí, eliminar"
      rejectLabel="Cancelar"
      acceptButtonStyleClass="p-button-danger"
    ></p-confirmDialog>

    <p-toast></p-toast>
  `,
})
export class DroneListComponent implements OnInit {
  drones: Drone[] = [];
  formVisible = false;
  selectedDrone?: Drone;
  loading = true;

  constructor(
    private droneService: DroneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadDrones();
  }

  loadDrones() {
    this.loading = true;
    this.droneService.getAll().subscribe({
      next: (data) => {
        this.drones = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'No se pudieron cargar los drones',
          life: 5000,
        });
        this.loading = false;
      },
    });
  }

  confirmDelete(drone: Drone) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar el dron "${drone.name}"?`,
      accept: () => this.deleteDrone(drone.id),
    });
  }

  deleteDrone(id: number) {
    this.droneService.delete(id).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Dron eliminado',
          detail: response.message || `Dron ID ${id} eliminado correctamente`,
          life: 3000,
        });
        this.loadDrones();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al eliminar',
          detail: err.message || 'Error inesperado',
          life: 5000,
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
