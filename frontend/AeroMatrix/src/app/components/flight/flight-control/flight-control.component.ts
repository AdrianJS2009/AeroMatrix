import { Component, type OnInit } from '@angular/core';
import type { MessageService } from 'primeng/api';
import type { DroneModel } from '../../../models/drone.model';
import type { DroneService } from '../../../services/drone.service';
import type { FlightService } from '../../../services/flight.service';
import type { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-flight-control',
  templateUrl: './flight-control.component.html',
  styleUrls: ['./flight-control.component.css'],
})
export class FlightControlComponent implements OnInit {
  drones: DroneModel[] = [];
  selectedDrone: DroneModel | null = null;
  commands = '';
  loading = true;
  executing = false;

  constructor(
    private droneService: DroneService,
    private flightService: FlightService,
    private messageService: MessageService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDrones();

    // Subscribe to drone updates
    this.notificationService.droneUpdates$.subscribe((drone) => {
      if (drone.id) {
        // Update the drone in the list
        const index = this.drones.findIndex((d) => d.id === drone.id);
        if (index !== -1) {
          this.drones[index] = drone;

          // Update selected drone if it's the one that was updated
          if (this.selectedDrone && this.selectedDrone.id === drone.id) {
            this.selectedDrone = drone;
          }
        }
      }
    });
  }

  loadDrones(): void {
    this.loading = true;
    this.droneService.getDrones().subscribe({
      next: (drones) => {
        this.drones = drones;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load drones',
        });
        this.loading = false;
      },
    });
  }

  selectDrone(drone: DroneModel): void {
    this.selectedDrone = drone;
  }

  executeCommands(): void {
    if (!this.selectedDrone) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a drone first',
      });
      return;
    }

    if (!this.commands.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter commands',
      });
      return;
    }

    this.executing = true;
    this.flightService
      .executeCommands(this.selectedDrone.id!, this.commands)
      .subscribe({
        next: (drone) => {
          // Update the drone in the list
          const index = this.drones.findIndex((d) => d.id === drone.id);
          if (index !== -1) {
            this.drones[index] = drone;
          }

          this.selectedDrone = drone;

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Commands executed successfully',
          });
          this.executing = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to execute commands',
          });
          this.executing = false;
        },
      });
  }

  addCommand(command: string): void {
    this.commands += command;
  }

  clearCommands(): void {
    this.commands = '';
  }
}
