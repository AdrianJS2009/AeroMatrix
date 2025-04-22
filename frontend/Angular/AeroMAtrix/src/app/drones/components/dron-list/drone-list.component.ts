import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Drone } from '../../models/drone.model';
import { DroneService } from '../../services/drone.service';
import { DroneFormComponent } from '../drone-form/drone-form.component';

@Component({
  selector: 'app-drone-list',
  standalone: true,
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
    BadgeModule,
    AvatarModule,
    RippleModule,
  ],
  providers: [MessageService, ConfirmationService],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('rowAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
  ],
  templateUrl: './drone-list.component.html',
  styleUrls: ['./drone-list.component.scss'],
})
export class DroneListComponent implements OnInit {
  drones: Drone[] = [];
  filteredDrones: Drone[] = [];
  formVisible = false;
  selectedDrone?: Drone;
  loading = true;

  constructor(
    private readonly droneService: DroneService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadDrones();
  }

  loadDrones(): void {
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

  confirmDelete(drone: Drone): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete drone "${drone.name}"?`,
      accept: () => this.deleteDrone(drone.id),
    });
  }

  deleteDrone(id: number): void {
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

  openForm(drone?: Drone): void {
    // Create a low level copy of the drone to avoid reference issues
    this.selectedDrone = drone ? { ...drone } : undefined;

    // Force a small delay
    setTimeout(() => {
      this.formVisible = true;
    }, 0);
  }

  closeForm(): void {
    this.formVisible = false;
    this.selectedDrone = undefined;
  }

  onSearch(event: Event): void {
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

  getAvatarColor(id: number): string {
    const colors = [
      '#3B82F6', // primary
      '#10B981', // green
      '#F59E0B', // yellow
      '#EF4444', // red
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#06B6D4', // cyan
    ];
    return colors[id % colors.length];
  }
}
