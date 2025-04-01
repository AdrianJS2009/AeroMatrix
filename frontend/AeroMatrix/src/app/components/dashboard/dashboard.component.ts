import { Component, type OnInit } from '@angular/core';
import type { MessageService } from 'primeng/api';
import type { DroneModel } from '../../models/drone.model';
import type { MatrixModel } from '../../models/matrix.model';
import type { DroneService } from '../../services/drone.service';
import type { MatrixService } from '../../services/matrix.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  matrices: MatrixModel[] = [];
  drones: DroneModel[] = [];
  loading = true;

  constructor(
    private matrixService: MatrixService,
    private droneService: DroneService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    Promise.all([
      this.matrixService.getMatrices().toPromise(),
      this.droneService.getDrones().toPromise(),
    ])
      .then(([matrices, drones]) => {
        this.matrices = matrices ?? [];
        this.drones = drones ?? [];
        this.loading = false;
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load dashboard data',
        });
        this.loading = false;
      });
  }

  getDronesInMatrix(matrixId: number): DroneModel[] {
    return this.drones.filter((drone) => drone.matrixId === matrixId);
  }
}
