import { Component, type OnInit } from '@angular/core';
import type { ActivatedRoute, Router } from '@angular/router';
import type { ConfirmationService, MessageService } from 'primeng/api';
import {
  Orientation,
  type DroneModel,
  type UpdateDroneRequest,
} from '../../../models/drone.model';
import type { MatrixModel } from '../../../models/matrix.model';
import type { DroneService } from '../../../services/drone.service';
import type { FlightService } from '../../../services/flight.service';
import type { MatrixService } from '../../../services/matrix.service';

@Component({
  selector: 'app-drone-detail',
  templateUrl: './drone-detail.component.html',
  styleUrls: ['./drone-detail.component.css'],
})
export class DroneDetailComponent implements OnInit {
  droneId!: number;
  drone: DroneModel | null = null;
  matrices: MatrixModel[] = [];
  loading = true;
  displayEditDialog = false;
  displayCommandDialog = false;
  editDrone: UpdateDroneRequest = {};
  commands = '';

  orientationOptions = [
    { label: 'North', value: Orientation.NORTH },
    { label: 'East', value: Orientation.EAST },
    { label: 'South', value: Orientation.SOUTH },
    { label: 'West', value: Orientation.WEST },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private droneService: DroneService,
    private matrixService: MatrixService,
    private flightService: FlightService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.droneId = +params['id'];
      this.loadData();
    });
  }

  loadData(): void {
    this.loading = true;

    Promise.all([
      this.droneService.getDrone(this.droneId).toPromise(),
      this.matrixService.getMatrices().toPromise(),
    ])
      .then(([drone, matrices]) => {
        this.drone = drone ?? null;
        this.matrices = matrices ?? [];
        this.loading = false;
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load drone details',
        });
        this.loading = false;
        this.router.navigate(['/drones']);
      });
  }

  getMatrixName(matrixId: number): string {
    const matrix = this.matrices.find((m) => m.id === matrixId);
    return matrix
      ? `Matrix #${matrix.id} (${matrix.maxX}x${matrix.maxY})`
      : `Matrix #${matrixId}`;
  }

  openEditDialog(): void {
    if (this.drone) {
      this.editDrone = {
        name: this.drone.name,
        model: this.drone.model,
        x: this.drone.x,
        y: this.drone.y,
        orientation: this.drone.orientation,
        matrixId: this.drone.matrixId,
      };
      this.displayEditDialog = true;
    }
  }

  updateDrone(): void {
    this.droneService.updateDrone(this.droneId, this.editDrone).subscribe({
      next: (drone) => {
        this.drone = drone;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Drone ${drone.name} updated successfully`,
        });
        this.displayEditDialog = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to update drone',
        });
      },
    });
  }

  openCommandDialog(): void {
    this.commands = '';
    this.displayCommandDialog = true;
  }

  executeCommands(): void {
    if (!this.commands.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter commands',
      });
      return;
    }

    this.flightService.executeCommands(this.droneId, this.commands).subscribe({
      next: (drone) => {
        this.drone = drone;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Commands executed successfully',
        });
        this.displayCommandDialog = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to execute commands',
        });
      },
    });
  }

  confirmDelete(): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete drone "${this.drone?.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDrone();
      },
    });
  }

  deleteDrone(): void {
    this.droneService.deleteDrone(this.droneId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Drone ${this.drone?.name} deleted successfully`,
        });
        this.router.navigate(['/drones']);
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
