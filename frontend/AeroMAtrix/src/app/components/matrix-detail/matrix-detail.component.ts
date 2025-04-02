import { Component, type OnInit } from '@angular/core';
import type { ActivatedRoute, Router } from '@angular/router';
import type { ConfirmationService, MessageService } from 'primeng/api';
import type { Drone } from '../../models/drone.model';
import type { Matrix } from '../../models/matrix.model';
import type { DroneService } from '../../services/drone.service';
import type { MatrixService } from '../../services/matrix.service';

@Component({
  selector: 'app-matrix-detail',
  templateUrl: './matrix-detail.component.html',
  styleUrls: ['./matrix-detail.component.scss'],
})
export class MatrixDetailComponent implements OnInit {
  matrixId!: number;
  matrix!: Matrix;
  loading = false;
  displayEditDialog = false;
  displayAddDroneDialog = false;
  selectedDrone: Drone | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router, // Public to use in template
    private matrixService: MatrixService,
    private droneService: DroneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.matrixId = +id;
        this.loadMatrix();
      }
    });
  }

  loadMatrix(): void {
    this.loading = true;
    this.matrixService.getMatrix(this.matrixId).subscribe({
      next: (data) => {
        this.matrix = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load matrix details',
          life: 3000,
        });
        this.router.navigate(['/matrices']);
      },
    });
  }

  showEditDialog(): void {
    this.displayEditDialog = true;
  }

  hideEditDialog(): void {
    this.displayEditDialog = false;
  }

  showAddDroneDialog(): void {
    this.displayAddDroneDialog = true;
    this.selectedDrone = null;
  }

  hideAddDroneDialog(): void {
    this.displayAddDroneDialog = false;
  }

  onMatrixUpdated(updatedMatrix: Matrix): void {
    this.hideEditDialog();
    this.matrix = updatedMatrix;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Matrix updated successfully',
      life: 3000,
    });
  }

  deleteDrone(drone: Drone): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete drone "${drone.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.droneService.deleteDrone(drone.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Drone deleted successfully',
              life: 3000,
            });
            this.loadMatrix();
          },
        });
      },
    });
  }

  editDrone(drone: Drone): void {
    this.router.navigate(['/drones', drone.id, 'edit']);
  }

  goToFlightControl(drone: Drone): void {
    this.router.navigate(['/flight-control'], {
      queryParams: { droneId: drone.id },
    });
  }
}
