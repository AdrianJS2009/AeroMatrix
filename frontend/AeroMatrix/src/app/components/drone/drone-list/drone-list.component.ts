import { Component, type OnInit } from '@angular/core';
import type { ConfirmationService, MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import {
  type CreateDroneRequest,
  type DroneModel,
  Orientation,
} from '../../../models/drone.model';
import type { MatrixModel } from '../../../models/matrix.model';
import type { DroneService } from '../../../services/drone.service';
import type { MatrixService } from '../../../services/matrix.service';

@Component({
  selector: 'app-drone-list',
  templateUrl: './drone-list.component.html',
  styleUrls: ['./drone-list.component.css'],
})
export class DroneListComponent implements OnInit {
  drones: DroneModel[] = [];
  matrices: MatrixModel[] = [];
  loading = true;
  displayCreateDialog = false;
  newDrone: CreateDroneRequest = {
    name: '',
    model: '',
    x: 0,
    y: 0,
    orientation: Orientation.NORTH,
    matrixId: 0,
  };

  orientationOptions = [
    { label: 'North', value: Orientation.NORTH },
    { label: 'East', value: Orientation.EAST },
    { label: 'South', value: Orientation.SOUTH },
    { label: 'West', value: Orientation.WEST },
  ];

  constructor(
    private readonly droneService: DroneService,
    private readonly matrixService: MatrixService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    Promise.all([
      lastValueFrom(this.droneService.getDrones()),
      lastValueFrom(this.matrixService.getMatrices()),
    ])
      .then(([drones, matrices]) => {
        this.drones = drones || [];
        this.matrices = matrices || [];
        this.loading = false;
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load data',
        });
        this.loading = false;
      });
  }

  getMatrixName(matrixId: number): string {
    const matrix = this.matrices.find((m) => m.id === matrixId);
    return matrix
      ? `Matrix #${matrix.id} (${matrix.maxX}x${matrix.maxY})`
      : `Matrix #${matrixId}`;
  }

  openCreateDialog(): void {
    if (this.matrices.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'You need to create a matrix first',
      });
      return;
    }

    this.newDrone = {
      name: '',
      model: 'Standard',
      x: 0,
      y: 0,
      orientation: Orientation.NORTH,
      matrixId: this.matrices[0].id!,
    };
    this.displayCreateDialog = true;
  }

  createDrone(): void {
    this.droneService.createDrone(this.newDrone).subscribe({
      next: (drone) => {
        this.drones.push(drone);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Drone ${drone.name} created successfully`,
        });
        this.displayCreateDialog = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to create drone',
        });
      },
    });
  }

  confirmDelete(drone: DroneModel): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete drone "${drone.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDrone(drone);
      },
    });
  }

  deleteDrone(drone: DroneModel): void {
    this.droneService.deleteDrone(drone.id!).subscribe({
      next: () => {
        this.drones = this.drones.filter((d) => d.id !== drone.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Drone ${drone.name} deleted successfully`,
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to delete drone',
        });
      },
    });
  }
}
