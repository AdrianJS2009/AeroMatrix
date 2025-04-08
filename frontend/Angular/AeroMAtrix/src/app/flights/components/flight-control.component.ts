import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SkeletonModule } from 'primeng/skeleton';
import { StepsModule } from 'primeng/steps';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { DroneMatrixComponent } from '../../drones/components/drone-matrix/drone-matrix.component';
import { Drone } from '../../drones/models/drone.model';
import { DroneService } from '../../drones/services/drone.service';
import { Matrix } from '../../matrices/models/matrix.model';
import { MatrixService } from '../../matrices/services/matrix.service';
import { FlightService } from '../services/flight.service';

@Component({
  selector: 'app-flight-control',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    PanelModule,
    ButtonModule,
    ToastModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule,
    ChipModule,
    SkeletonModule,
    TabViewModule,
    TooltipModule,
    RippleModule,
    BadgeModule,
    AvatarModule,
    StepsModule,
    TagModule,
    ScrollPanelModule,
    InputSwitchModule,
    DroneMatrixComponent,
  ],
  providers: [MessageService],
  templateUrl: './flight-control.component.html',
  styleUrls: ['./flight-control.component.scss'],
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
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
  ],
})
export class FlightControlComponent implements OnInit {
  // Properties
  drones: Drone[] = [];
  matrices: Matrix[] = [];
  loading = true;
  darkMode = false;

  // Single
  selectedDrone?: Drone;
  selectedMatrix?: Matrix;
  commandsText = '';
  commandsTextInvalid = false;
  executingSingle = false;

  // Group
  multiSelectedDrones: Drone[] = [];
  commandsGroupText = '';
  commandsGroupTextInvalid = false;
  executingGroup = false;

  // Batch
  batchCommands: { droneId: number | null; commands: string }[] = [];
  executingBatch = false;

  // Flight history
  flightHistory: {
    drone: string;
    commands: string;
    startPosition: string;
    endPosition: string;
    status: string;
    time: string;
  }[] = [];

  constructor(
    private readonly droneService: DroneService,
    private readonly matrixService: MatrixService,
    private readonly flightService: FlightService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDrones();
    this.loadMatrices();
    this.addBatchCommand();
  }

  // Load drones and matrices from services
  loadDrones(): void {
    this.loading = true;
    this.droneService.getAll().subscribe({
      next: (d) => {
        this.drones = d;
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

  loadMatrices(): void {
    this.matrixService.getAll().subscribe({
      next: (matrices) => {
        this.matrices = matrices;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'Could not load matrices',
          life: 5000,
        });
      },
    });
  }

  // Management of selected drones and matrices
  onDroneSelect(): void {
    if (this.selectedDrone) {
      this.loadMatrixForDrone(this.selectedDrone.matrixId);
    } else {
      this.selectedMatrix = undefined;
    }
  }

  onMatrixDroneSelect(drone: Drone): void {
    this.selectedDrone = drone;
  }

  loadMatrixForDrone(matrixId: number): void {
    const matrix = this.matrices.find((m) => m.id === matrixId);
    if (matrix) {
      this.selectedMatrix = matrix;
    }
  }

  // Validation of commands
  validateCommands(commands: string): boolean {
    return /^[ALR]+$/i.test(commands);
  }

  addCommand(command: string): void {
    this.commandsText += command;
    this.commandsTextInvalid = false;
  }

  clearCommands(): void {
    this.commandsText = '';
    this.commandsTextInvalid = false;
  }

  addGroupCommand(command: string): void {
    this.commandsGroupText += command;
    this.commandsGroupTextInvalid = false;
  }

  clearGroupCommands(): void {
    this.commandsGroupText = '';
    this.commandsGroupTextInvalid = false;
  }

  // Update drones and matrices
  private refreshDronesAndMatrix(): void {
    this.droneService.getAll().subscribe({
      next: (updatedDrones) => {
        this.drones = updatedDrones;
        if (this.selectedMatrix) {
          const updatedMatrix = this.matrices.find(
            (m) => m.id === this.selectedMatrix?.id
          );
          if (updatedMatrix) {
            updatedMatrix.drones = updatedDrones.filter(
              (d) => d.matrixId === updatedMatrix.id
            );
            this.selectedMatrix = { ...updatedMatrix };
          }
        }
      },
      error: (err) => console.error('Error updating drones:', err),
    });
  }

  // Execute commands
  executeSingle(): void {
    if (!this.selectedDrone?.id || !this.commandsText) return;

    const droneId = this.selectedDrone.id;
    const commands = this.commandsText
      .toUpperCase()
      .split('')
      .map((char) => this.mapCommand(char))
      .filter((cmd): cmd is string => !!cmd);

    if (commands.length === 0) return;

    this.flightService.sendCommands(droneId, commands).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Commands executed',
        });
        this.refreshDronesAndMatrix();
        this.commandsText = '';
      },
      error: (err) => {
        console.error(`Error sending commands to drone ${droneId}:`, err);
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to execute commands',
        });
      },
    });
  }

  executeGroup(): void {
    if (this.multiSelectedDrones.length === 0 || !this.commandsGroupText)
      return;

    const commands = this.commandsGroupText
      .toUpperCase()
      .split('')
      .map((char) => this.mapCommand(char))
      .filter((cmd): cmd is string => cmd !== null);
    if (commands.length === 0) return;

    const droneIds = this.multiSelectedDrones.map((d) => d.id);
    this.flightService.sendCommandsToMany(droneIds, commands).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Commands sent to selected drones',
        });
        this.refreshDronesAndMatrix();
        this.commandsGroupText = '';
      },
      error: (err) => {
        console.error('Error sending commands to group:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to execute group commands',
        });
      },
    });
  }

  executeBatch(): void {
    if (this.batchCommands.length === 0) return;

    const batchPayload = this.batchCommands
      .filter((batch) => batch.droneId !== null && batch.commands.trim() !== '')
      .map((batch) => ({
        droneId: batch.droneId as number,
        commands: batch.commands
          .toUpperCase()
          .split('')
          .map((char) => this.mapCommand(char))
          .filter((cmd): cmd is string => !!cmd),
      }));

    if (batchPayload.length === 0) return;

    this.flightService.sendBatchCommands(batchPayload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Batch commands executed',
        });
        this.refreshDronesAndMatrix();
        this.batchCommands = [];
      },
      error: (err) => {
        console.error('Error executing batch commands:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to execute batch',
        });
      },
    });
  }

  isBatchCommandInvalid(commands: string): boolean {
    return commands.length > 0 && !this.validateCommands(commands);
  }

  isValidBatch(): boolean {
    if (this.batchCommands.length === 0) return false;
    return this.batchCommands.some(
      (b) =>
        b.droneId !== null &&
        b.commands.length > 0 &&
        this.validateCommands(b.commands)
    );
  }

  addBatchCommand(): void {
    this.batchCommands.push({ droneId: null, commands: '' });
  }

  getOrientationLabel(orientation: string): string {
    const labels: Record<string, string> = {
      N: 'North',
      S: 'South',
      E: 'East',
      W: 'West',
      O: 'West',
    };
    return labels[orientation] || orientation;
  }

  getOrientationSeverity(
    orientation: string
  ): 'success' | 'info' | 'warning' | 'danger' {
    const map: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
      N: 'success',
      S: 'warning',
      E: 'info',
      W: 'info',
    };
    return map[orientation] || 'info';
  }

  getDroneColor(id: number): string {
    const colors = [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#EC4899',
      '#06B6D4',
    ];
    return colors[id % colors.length];
  }

  getRandomColor(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#EC4899',
      '#06B6D4',
    ];
    return colors[Math.abs(hash) % colors.length];
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    const map: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
      Completed: 'success',
      'In-Progress': 'info',
      Failed: 'danger',
      Pending: 'warning',
    };
    return map[status] || 'info';
  }

  addToFlightHistory(
    drone: string,
    commands: string,
    startPosition: string,
    endPosition: string,
    status: string
  ): void {
    this.flightHistory.unshift({
      drone,
      commands,
      startPosition,
      endPosition,
      status,
      time: this.getRelativeTime(new Date()),
    });
    if (this.flightHistory.length > 10) {
      this.flightHistory = this.flightHistory.slice(0, 10);
    }
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
  }

  mapCommand(char: string): string | null {
    const commandMap: Record<string, string> = {
      A: 'MOVE_FORWARD',
      L: 'TURN_LEFT',
      R: 'TURN_RIGHT',
    };
    return commandMap[char.toUpperCase()] ?? null;
  }
}
