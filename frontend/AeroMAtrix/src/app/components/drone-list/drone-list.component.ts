import { Component, type OnInit } from '@angular/core';
import type { Router } from '@angular/router';
import type { ConfirmationService, MessageService } from 'primeng/api';
import type { Drone } from '../../models/drone.model';
import type { DroneService } from '../../services/drone.service';

@Component({
  selector: 'app-drone-list',
  templateUrl: './drone-list.component.html',
  styleUrls: ['./drone-list.component.scss'],
})
export class DroneListComponent implements OnInit {
  drones: Drone[] = [];
  loading = false;

  constructor(
    private droneService: DroneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDrones();
  }

  loadDrones(): void {
    this.loading = true;
    this.droneService.listDrones().subscribe({
      next: (data) => {
        this.drones = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  createDrone(): void {
    this.router.navigate(['/drones/new']);
  }

  editDrone(drone: Drone): void {
    this.router.navigate(['/drones', drone.id, 'edit']);
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
            this.loadDrones();
          },
        });
      },
    });
  }

  viewMatrix(matrixId: number): void {
    this.router.navigate(['/matrices', matrixId]);
  }

  goToFlightControl(drone: Drone): void {
    this.router.navigate(['/flight-control'], {
      queryParams: { droneId: drone.id },
    });
  }
}
