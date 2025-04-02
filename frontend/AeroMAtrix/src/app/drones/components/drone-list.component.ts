import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
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
    TooltipModule,
    InputTextModule,
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-card styleClass="drone-list-card">
      <div class="flex justify-content-between align-items-center mb-3">
        <h2 class="m-0">Drones</h2>
        <button
          pButton
          icon="pi pi-plus"
          label="New Drone"
          (click)="openForm()"
          class="p-button-sm"
          pTooltip="Add a new drone"
          tooltipPosition="left"
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
        [rowHover]="true"
        dataKey="id"
        [globalFilterFields]="['name', 'model']"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} drones"
      >
        <ng-template pTemplate="caption">
          <div class="flex justify-content-between align-items-center">
            <h5 class="m-0">Manage Drones</h5>
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <input
                pInputText
                type="text"
                placeholder="Search..."
                (input)="onSearch($event)"
              />
            </span>
          </div>
        </ng-template>
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="id" style="width: 5rem">
              ID <p-sortIcon field="id"></p-sortIcon>
            </th>
            <th pSortableColumn="name">
              Name <p-sortIcon field="name"></p-sortIcon>
            </th>
            <th pSortableColumn="model">
              Model <p-sortIcon field="model"></p-sortIcon>
            </th>
            <th>Position</th>
            <th>Orientation</th>
            <th pSortableColumn="matrixId">
              Matrix <p-sortIcon field="matrixId"></p-sortIcon>
            </th>
            <th style="width: 8rem">Actions</th>
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
                [value]="getOrientationLabel(drone.orientation)"
                [rounded]="true"
                [severity]="getOrientationSeverity(drone.orientation)"
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
                  pTooltip="Edit"
                  tooltipPosition="top"
                ></button>
                <button
                  pButton
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-sm p-button-danger"
                  (click)="confirmDelete(drone)"
                  pTooltip="Delete"
                  tooltipPosition="top"
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
                No drones found. Create a new one to get started.
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
      header="Confirm Deletion"
      icon="pi pi-exclamation-triangle"
      acceptLabel="Yes, delete"
      rejectLabel="Cancel"
      acceptButtonStyleClass="p-button-danger"
    ></p-confirmDialog>

    <p-toast></p-toast>
  `,
})
export class DroneListComponent implements OnInit {
  drones: Drone[] = [];
  filteredDrones: Drone[] = [];
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
        this.filteredDrones = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'Could not load drones',
          life: 5000,
        });
        this.loading = false;
      },
    });
  }

  confirmDelete(drone: Drone) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete drone "${drone.name}"?`,
      accept: () => this.deleteDrone(drone.id),
    });
  }

  deleteDrone(id: number) {
    this.droneService.delete(id).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Drone Deleted',
          detail: response.message || `Drone ID ${id} deleted successfully`,
          life: 3000,
        });
        this.loadDrones();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Deleting',
          detail: err.message || 'Unexpected error',
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

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    if (!filterValue) {
      this.filteredDrones = this.drones;
      return;
    }

    this.filteredDrones = this.drones.filter(
      (drone) =>
        drone.name.toLowerCase().includes(filterValue) ||
        drone.model.toLowerCase().includes(filterValue)
    );
  }

  getOrientationLabel(orientation: string): string {
    const labels = {
      N: 'North',
      S: 'South',
      E: 'East',
      W: 'West',
      O: 'West',
    };
    return labels[orientation as keyof typeof labels] || orientation;
  }

  getOrientationSeverity(
    orientation: string
  ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    const map = {
      N: 'success',
      S: 'warning',
      E: 'info',
      W: 'contrast',
      O: 'contrast',
    } as const;

    return map[orientation as keyof typeof map] || 'success';
  }
}
