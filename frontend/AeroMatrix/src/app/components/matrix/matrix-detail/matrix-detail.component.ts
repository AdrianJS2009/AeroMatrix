import { Component, type OnInit } from '@angular/core';
import type { ActivatedRoute, Router } from '@angular/router';
import type { ConfirmationService, MessageService } from 'primeng/api';
import {
  type CreateDroneRequest,
  type DroneModel,
  Orientation,
} from '../../../models/drone.model';
import type {
  MatrixModel,
  UpdateMatrixRequest,
} from '../../../models/matrix.model';
import type { DroneService } from '../../../services/drone.service';
import type { MatrixService } from '../../../services/matrix.service';

@Component({
  selector: 'app-matrix-detail',
  templateUrl: './matrix-detail.component.html',
  styleUrls: ['./matrix-detail.component.css'],
})
export class MatrixDetailComponent implements OnInit {
  matrixId!: number;
  matrix: MatrixModel | null = null;
  loading = true;
  displayEditDialog = false;
  displayAddDroneDialog = false;
  editMatrix: UpdateMatrixRequest = { maxX: 0, maxY: 0 };
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
    private route: ActivatedRoute,
    private router: Router,
    private matrixService: MatrixService,
    private droneService: DroneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.matrixId = +params['id'];
      this.loadMatrix();
    });
  }

  loadMatrix(): void {
    this.loading = true;
    this.matrixService.getMatrix(this.matrixId).subscribe({
      next: (data) => {
        this.matrix = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load matrix details',
        });
        this.loading = false;
        this.router.navigate(['/matrices']);
      },
    });
  }

  openEditDialog(): void {
    if (this.matrix) {
      this.editMatrix = {
        maxX: this.matrix.maxX,
        maxY: this.matrix.maxY,
      };
      this.displayEditDialog = true;
    }
  }

  updateMatrix(): void {
    this.matrixService.updateMatrix(this.matrixId, this.editMatrix).subscribe({
      next: (matrix) => {
        this.matrix = matrix;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Matrix #${matrix.id} updated successfully`,
        });
        this.displayEditDialog = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to update matrix',
        });
      },
    });
  }

  openAddDroneDialog(): void {
    this.newDrone = {
      name: '',
      model: 'Standard',
      x: 0,
      y: 0,
      orientation: Orientation.NORTH,
      matrixId: this.matrixId,
    };
    this.displayAddDroneDialog = true;
  }

  addDrone(): void {
    this.droneService.createDrone(this.newDrone).subscribe({
      next: (drone) => {
        if (this.matrix?.drones) {
          this.matrix.drones.push(drone);
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Drone ${drone.name} added successfully`,
        });
        this.displayAddDroneDialog = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to add drone',
        });
      },
    });
  }

  confirmDeleteDrone(drone: DroneModel): void {
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
        if (this.matrix?.drones) {
          this.matrix.drones = this.matrix.drones.filter(
            (d) => d.id !== drone.id
          );
        }
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
