import { Component, type OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DroneModel } from '../../../models/drone.model';
import {
  BatchDroneCommand,
  BatchDroneCommandRequest,
} from '../../../models/flight.model';
import { DroneService } from '../../../services/drone.service';
import { FlightService } from '../../../services/flight.service';

@Component({
  selector: 'app-batch-command',
  templateUrl: './batch-command.component.html',
  styleUrls: ['./batch-command.component.css'],
})
export class BatchCommandComponent implements OnInit {
  drones: DroneModel[] = [];
  selectedDrones: DroneModel[] = [];
  batchCommands: BatchDroneCommand[] = [];
  sharedCommands = '';
  loading = true;
  executing = false;

  constructor(
    private droneService: DroneService,
    private flightService: FlightService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDrones();
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

  addToBatch(): void {
    if (this.selectedDrones.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select at least one drone',
      });
      return;
    }

    if (!this.sharedCommands.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter commands',
      });
      return;
    }

    for (const drone of this.selectedDrones) {
      // Check if drone is already in batch
      const existingIndex = this.batchCommands.findIndex(
        (cmd) => cmd.droneId === drone.id
      );

      if (existingIndex !== -1) {
        // Update existing command
        this.batchCommands[existingIndex].commands = this.sharedCommands;
      } else {
        // Add new command
        this.batchCommands.push({
          droneId: drone.id!,
          commands: this.sharedCommands,
        });
      }
    }

    this.selectedDrones = [];
    this.sharedCommands = '';

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Commands added to batch',
    });
  }

  removeBatchItem(index: number): void {
    this.batchCommands.splice(index, 1);
  }

  clearBatch(): void {
    this.batchCommands = [];
  }

  executeBatch(): void {
    if (this.batchCommands.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Batch is empty',
      });
      return;
    }

    this.executing = true;
    const request: BatchDroneCommandRequest = {
      commands: this.batchCommands,
    };

    this.flightService.executeBatchCommands(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Batch commands executed successfully',
        });
        this.batchCommands = [];
        this.executing = false;

        // Reload drones to get updated positions
        this.loadDrones();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to execute batch commands',
        });
        this.executing = false;
      },
    });
  }

  executeSequence(): void {
    if (this.selectedDrones.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select at least one drone',
      });
      return;
    }

    if (!this.sharedCommands.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter commands',
      });
      return;
    }

    this.executing = true;
    const droneIds = this.selectedDrones.map((drone) => drone.id!);

    this.flightService
      .executeCommandsInSequence(droneIds, this.sharedCommands)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Commands executed in sequence successfully',
          });
          this.selectedDrones = [];
          this.sharedCommands = '';
          this.executing = false;

          // Reload drones to get updated positions
          this.loadDrones();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              error.error?.message || 'Failed to execute commands in sequence',
          });
          this.executing = false;
        },
      });
  }

  getDroneName(droneId: number): string {
    const drone = this.drones.find((d) => d.id === droneId);
    return drone ? drone.name : `Drone #${droneId}`;
  }
}
