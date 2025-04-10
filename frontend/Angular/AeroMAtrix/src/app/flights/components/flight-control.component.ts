import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
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
import { finalize } from 'rxjs/operators';

import { DroneMatrixComponent } from '../../drones/components/drone-matrix/drone-matrix.component';
import { Drone } from '../../drones/models/drone.model';
import { DroneService } from '../../drones/services/drone.service';
import { Matrix } from '../../matrices/models/matrix.model';
import { MatrixService } from '../../matrices/services/matrix.service';
import { FlightService } from '../services/flight.service';

interface Position {
  x: number;
  y: number;
  orientation: string;
}

interface CommandValidationResult {
  hasErrors: boolean;
  errorMessage?: string;
  finalPosition?: Position;
  collisions?: {
    x: number;
    y: number;
    droneName: string;
    stepNumber?: number;
  }[];
  path?: Position[];
  stepWithError?: number;
}

interface GroupCollision {
  x: number;
  y: number;
  drone1: string;
  drone2: string;
}

interface BatchCommand {
  droneId: number | null;
  commands: string;
  validationResult?: CommandValidationResult;
}

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
  // Single
  selectedDrone?: Drone;
  selectedMatrix?: Matrix;
  commandsText = '';
  commandsTextInvalid = false;
  executingSingle = false;
  commandValidationResult?: CommandValidationResult;

  // Group
  multiSelectedDrones: Drone[] = [];
  commandsGroupText = '';
  commandsGroupTextInvalid = false;
  executingGroup = false;
  groupValidationResults: Map<number, CommandValidationResult> = new Map();
  groupCollisions: GroupCollision[] = [];

  // Batch
  batchCommands: BatchCommand[] = [];
  executingBatch = false;
  batchCollisions: GroupCollision[] = [];

  // Flight history
  flightHistory: {
    drone: string;
    commands: string;
    startPosition: string;
    endPosition: string;
    status: string;
    time: string;
  }[] = [];

  // Available drones for dropdown selection
  availableDrones: { label: string; value: number }[] = [];

  selectedMatrixId?: number;
  selectedDroneId?: number;
  matrixOptions: { label: string; value: number }[] = [];
  droneOptions: { label: string; value: number }[] = [];
  multiSelectedDroneIds: number[] = [];

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
    this.initializeMatrixOptions();
  }

  // Load drones and matrices from services
  loadDrones(): void {
    this.loading = true;
    this.droneService.getAll().subscribe({
      next: (d) => {
        this.drones = d;
        // Populate availableDrones for dropdown
        this.availableDrones = d.map((drone) => ({
          label: drone.name || `Drone ${drone.id}`,
          value: drone.id,
        }));
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
        this.initializeMatrixOptions();
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
    if (!this.selectedDroneId) {
      this.selectedDrone = undefined;
      this.commandValidationResult = undefined;
      return;
    }

    const drone = this.drones.find((d) => d.id === this.selectedDroneId);
    if (drone) {
      this.selectedDrone = drone;
      this.validateCommands();
    }
  }

  onMatrixDroneSelect(drone: Drone): void {
    this.selectedDrone = drone;
    this.selectedDroneId = drone.id;
    this.validateCommands();
  }

  // Validation of commands
  validateCommands(): void {
    // Clear validation result if no drone selected, no commands, or invalid format
    if (!this.selectedDrone || !this.commandsText) {
      this.commandValidationResult = undefined;
      return;
    }

    // Check command format first
    if (!this.validateCommandFormat(this.commandsText)) {
      this.commandsTextInvalid = true;
      this.commandValidationResult = {
        hasErrors: true,
        errorMessage:
          'Commands must only contain A (Advance), L (Left), and R (Right) characters',
      };
      return;
    } else {
      this.commandsTextInvalid = false;
    }

    // Simulate the commands to check for boundaries and collisions
    const result = this.simulateCommands(
      this.selectedDrone,
      this.commandsText,
      this.selectedMatrix?.drones.filter(
        (d) => d.id !== this.selectedDrone?.id
      ) || []
    );
    this.commandValidationResult = result;
  }

  validateCommandFormat(commands: string): boolean {
    return /^[ALR]+$/i.test(commands);
  }

  addCommand(command: string): void {
    this.commandsText += command;
    this.commandsTextInvalid = false;
    this.validateCommands();
  }

  clearCommands(): void {
    this.commandsText = '';
    this.commandsTextInvalid = false;
    this.commandValidationResult = undefined;
  }

  addGroupCommand(command: string): void {
    this.commandsGroupText += command;
    this.commandsGroupTextInvalid = false;
    this.validateGroupCommands();
  }

  clearGroupCommands(): void {
    this.commandsGroupText = '';
    this.commandsGroupTextInvalid = false;
    this.groupValidationResults.clear();
    this.groupCollisions = [];
  }

  // Simulate drone movement to validate commands
  simulateCommands(
    drone: Drone,
    commands: string,
    otherDrones: Drone[] = []
  ): CommandValidationResult {
    if (!this.selectedMatrix) {
      return {
        hasErrors: true,
        errorMessage: 'No matrix selected for command simulation',
      };
    }

    // Create a copy of the drone to simulate movement
    const simulatedDrone: Position = {
      x: drone.x,
      y: drone.y,
      orientation: drone.orientation,
    };

    const collisions: {
      x: number;
      y: number;
      droneName: string;
      stepNumber?: number;
    }[] = [];

    const path: Position[] = [{ ...simulatedDrone }];

    // Process each command
    for (let i = 0; i < commands.toUpperCase().length; i++) {
      const cmd = commands.toUpperCase()[i];
      switch (cmd) {
        case 'A': // Advance
          let newX = simulatedDrone.x;
          let newY = simulatedDrone.y;

          // Calculate new position based on orientation
          switch (simulatedDrone.orientation) {
            case 'N':
              newY += 1;
              break;
            case 'S':
              newY -= 1;
              break;
            case 'E':
              newX += 1;
              break;
            case 'W':
              newX -= 1;
              break;
          }

          // Check if new position is within matrix bounds
          if (
            newX < 0 ||
            newY < 0 ||
            newX >= this.selectedMatrix.maxX ||
            newY >= this.selectedMatrix.maxY
          ) {
            // More detailed error message showing which boundary would be crossed
            let boundaryMessage = '';
            if (newX < 0) boundaryMessage = 'western boundary (x < 0)';
            else if (newY < 0) boundaryMessage = 'southern boundary (y < 0)';
            else if (newX >= this.selectedMatrix.maxX)
              boundaryMessage = `eastern boundary (x ≥ ${this.selectedMatrix.maxX})`;
            else if (newY >= this.selectedMatrix.maxY)
              boundaryMessage = `northern boundary (y ≥ ${this.selectedMatrix.maxY})`;

            return {
              hasErrors: true,
              errorMessage: `Command would move drone out of bounds at step ${
                i + 1
              } (${cmd}), crossing the ${boundaryMessage}`,
              finalPosition: simulatedDrone,
              stepWithError: i,
            };
          }

          // Update position
          simulatedDrone.x = newX;
          simulatedDrone.y = newY;

          // Check for collisions with other drones
          for (const otherDrone of otherDrones) {
            if (otherDrone.x === newX && otherDrone.y === newY) {
              collisions.push({
                x: newX,
                y: newY,
                droneName: otherDrone.name || `Drone ${otherDrone.id}`,
                stepNumber: i + 1,
              });
            }
          }

          break;

        case 'L': // Turn Left
          switch (simulatedDrone.orientation) {
            case 'N':
              simulatedDrone.orientation = 'W';
              break;
            case 'S':
              simulatedDrone.orientation = 'E';
              break;
            case 'E':
              simulatedDrone.orientation = 'N';
              break;
            case 'W':
              simulatedDrone.orientation = 'S';
              break;
          }
          break;

        case 'R': // Turn Right
          switch (simulatedDrone.orientation) {
            case 'N':
              simulatedDrone.orientation = 'E';
              break;
            case 'S':
              simulatedDrone.orientation = 'W';
              break;
            case 'E':
              simulatedDrone.orientation = 'S';
              break;
            case 'W':
              simulatedDrone.orientation = 'N';
              break;
          }
          break;
      }

      // Add current position to path
      path.push({ ...simulatedDrone });
    }

    return {
      hasErrors: false,
      finalPosition: simulatedDrone,
      collisions: collisions.length > 0 ? collisions : undefined,
      path: path,
    };
  }

  // Validate group commands
  validateGroupCommands(): void {
    if (
      !this.commandsGroupText ||
      !this.validateCommandFormat(this.commandsGroupText)
    ) {
      this.groupValidationResults.clear();
      this.groupCollisions = [];
      return;
    }

    this.groupValidationResults.clear();
    this.groupCollisions = [];

    // Simulate each drone's movement
    const simulatedPositions = new Map<number, Position[]>();

    for (const drone of this.multiSelectedDrones) {
      const result = this.simulateCommands(drone, this.commandsGroupText, []);
      this.groupValidationResults.set(drone.id, result);

      if (!result.hasErrors && result.finalPosition) {
        // Store the path for collision detection
        const path: Position[] = this.generatePath(
          drone,
          this.commandsGroupText
        );
        simulatedPositions.set(drone.id, path);
      }
    }

    // Check for collisions between drones
    this.detectGroupCollisions(simulatedPositions);
  }

  // Generate the path a drone would take with given commands
  generatePath(drone: Drone, commands: string): Position[] {
    const path: Position[] = [
      { x: drone.x, y: drone.y, orientation: drone.orientation },
    ];
    const simulatedDrone: Position = { ...path[0] };

    for (const cmd of commands.toUpperCase()) {
      switch (cmd) {
        case 'A': // Advance
          switch (simulatedDrone.orientation) {
            case 'N':
              simulatedDrone.y += 1;
              break;
            case 'S':
              simulatedDrone.y -= 1;
              break;
            case 'E':
              simulatedDrone.x += 1;
              break;
            case 'W':
              simulatedDrone.x -= 1;
              break;
          }
          break;
        case 'L': // Turn Left
          switch (simulatedDrone.orientation) {
            case 'N':
              simulatedDrone.orientation = 'W';
              break;
            case 'S':
              simulatedDrone.orientation = 'E';
              break;
            case 'E':
              simulatedDrone.orientation = 'N';
              break;
            case 'W':
              simulatedDrone.orientation = 'S';
              break;
          }
          break;
        case 'R': // Turn Right
          switch (simulatedDrone.orientation) {
            case 'N':
              simulatedDrone.orientation = 'E';
              break;
            case 'S':
              simulatedDrone.orientation = 'W';
              break;
            case 'E':
              simulatedDrone.orientation = 'S';
              break;
            case 'W':
              simulatedDrone.orientation = 'N';
              break;
          }
          break;
      }
      path.push({ ...simulatedDrone });
    }

    return path;
  }

  // Detect collisions between drones in group commands
  detectGroupCollisions(simulatedPositions: Map<number, Position[]>): void {
    this.groupCollisions = [];

    const droneIds = Array.from(simulatedPositions.keys());

    // Compare each pair of drones
    for (let i = 0; i < droneIds.length; i++) {
      const drone1Id = droneIds[i];
      const drone1 = this.drones.find((d) => d.id === drone1Id);
      const path1 = simulatedPositions.get(drone1Id) || [];

      for (let j = i + 1; j < droneIds.length; j++) {
        const drone2Id = droneIds[j];
        const drone2 = this.drones.find((d) => d.id === drone2Id);
        const path2 = simulatedPositions.get(drone2Id) || [];

        // Check for collisions at each step
        const maxSteps = Math.max(path1.length, path2.length);

        for (let step = 0; step < maxSteps; step++) {
          const pos1 =
            step < path1.length ? path1[step] : path1[path1.length - 1];
          const pos2 =
            step < path2.length ? path2[step] : path2[path2.length - 1];

          if (pos1.x === pos2.x && pos1.y === pos2.y) {
            this.groupCollisions.push({
              x: pos1.x,
              y: pos1.y,
              drone1: drone1?.name ?? `Drone ${drone1Id}`,
              drone2: drone2?.name ?? `Drone ${drone2Id}`,
            });
            break; // Only report the first collision between each pair
          }
        }
      }
    }
  }

  // Check if there are any errors in group validation
  hasGroupValidationErrors(): boolean {
    if (this.groupCollisions.length > 0) {
      return true;
    }

    for (const result of this.groupValidationResults.values()) {
      if (result.hasErrors) {
        return true;
      }
    }

    return false;
  }

  // Check if there are any collisions in group commands
  hasGroupCollisions(): boolean {
    return this.groupCollisions.length > 0;
  }

  // Get all group collisions
  getGroupCollisions(): GroupCollision[] {
    return this.groupCollisions;
  }

  // Validate batch commands
  validateBatchCommand(index: number): void {
    const command = this.batchCommands[index];

    if (
      !command.droneId ||
      !command.commands ||
      !this.validateCommandFormat(command.commands)
    ) {
      command.validationResult = undefined;
      return;
    }

    const drone = this.drones.find((d) => d.id === command.droneId);
    if (!drone) {
      command.validationResult = {
        hasErrors: true,
        errorMessage: 'Selected drone not found',
      };
      return;
    }

    // Validate the command for this drone
    command.validationResult = this.simulateCommands(
      drone,
      command.commands,
      this.selectedMatrix?.drones.filter((d) => d.id !== drone.id) || []
    );

    // After validating individual commands, check for batch collisions
    this.validateBatchCollisions();
  }

  // Validate all batch commands for collisions
  validateBatchCollisions(): void {
    this.batchCollisions = [];

    // Generate paths for all valid batch commands
    const simulatedPositions = new Map<number, Position[]>();

    for (const command of this.batchCommands) {
      if (
        command.droneId &&
        command.commands &&
        this.validateCommandFormat(command.commands)
      ) {
        const drone = this.drones.find((d) => d.id === command.droneId);
        if (drone) {
          const path = this.generatePath(drone, command.commands);
          simulatedPositions.set(drone.id, path);
        }
      }
    }

    // Check for collisions between drones
    const droneIds = Array.from(simulatedPositions.keys());

    // Compare each pair of drones
    for (let i = 0; i < droneIds.length; i++) {
      const drone1Id = droneIds[i];
      const drone1 = this.drones.find((d) => d.id === drone1Id);
      const path1 = simulatedPositions.get(drone1Id) || [];

      for (let j = i + 1; j < droneIds.length; j++) {
        const drone2Id = droneIds[j];
        const drone2 = this.drones.find((d) => d.id === drone2Id);
        const path2 = simulatedPositions.get(drone2Id) || [];

        // Check for collisions at each step
        const maxSteps = Math.max(path1.length, path2.length);

        for (let step = 0; step < maxSteps; step++) {
          const pos1 =
            step < path1.length ? path1[step] : path1[path1.length - 1];
          const pos2 =
            step < path2.length ? path2[step] : path2[path2.length - 1];

          if (pos1.x === pos2.x && pos1.y === pos2.y) {
            this.batchCollisions.push({
              x: pos1.x,
              y: pos1.y,
              drone1: drone1?.name ?? `Drone ${drone1Id}`,
              drone2: drone2?.name ?? `Drone ${drone2Id}`,
            });
            break; // Only report the first collision between each pair
          }
        }
      }
    }
  }

  // Check if there are any errors in batch validation
  hasBatchValidationErrors(): boolean {
    // Check for collisions
    if (this.batchCollisions.length > 0) {
      return true;
    }

    // Check for individual command errors
    for (const command of this.batchCommands) {
      if (command.validationResult?.hasErrors) {
        return true;
      }
    }

    return false;
  }

  // Check if there are any collisions in batch commands
  hasBatchCollisions(): boolean {
    return this.batchCollisions.length > 0;
  }

  // Get all batch collisions
  getBatchCollisions(): GroupCollision[] {
    return this.batchCollisions;
  }

  // Update drones and matrices
  private refreshDronesAndMatrix(): void {
    this.droneService.getAll().subscribe({
      next: (updatedDrones) => {
        this.drones = updatedDrones;

        // Update availableDrones
        this.availableDrones = updatedDrones.map((drone) => ({
          label: drone.name || `Drone ${drone.id}`,
          value: drone.id,
        }));

        // Refresh matrices to get updated drone assignments
        this.matrixService.getAll().subscribe({
          next: (matrices) => {
            this.matrices = matrices;

            // Update matrix options
            this.matrixOptions = matrices.map((matrix) => ({
              label: `Matrix ${matrix.id} (${matrix.maxX}x${matrix.maxY})`,
              value: matrix.id,
            }));

            // Update selected matrix if it exists
            if (this.selectedMatrixId) {
              const updatedMatrix = matrices.find(
                (m) => m.id === this.selectedMatrixId
              );
              if (updatedMatrix) {
                this.selectedMatrix = updatedMatrix;

                // Update drone options for this matrix
                this.droneOptions = updatedMatrix.drones.map((drone) => ({
                  label: drone.name || `Drone ${drone.id}`,
                  value: drone.id,
                }));

                // Revalidate commands if needed
                if (this.selectedDrone && this.commandsText) {
                  this.validateCommands();
                }

                if (
                  this.multiSelectedDrones.length > 0 &&
                  this.commandsGroupText
                ) {
                  this.validateGroupCommands();
                }

                for (let i = 0; i < this.batchCommands.length; i++) {
                  this.validateBatchCommand(i);
                }
              }
            }
          },
        });
      },
      error: (err) => console.error('Error updating drones:', err),
    });
  }

  // Execute commands
  executeSingle(): void {
    if (!this.selectedDrone?.id || !this.commandsText) return;

    if (!this.validateCommandFormat(this.commandsText)) {
      this.commandsTextInvalid = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Commands',
        detail: 'Commands must only contain A, L, and R characters',
        life: 5000,
      });
      return;
    }

    // Validate commands before execution
    if (!this.commandValidationResult) {
      this.validateCommands();
    }

    if (this.commandValidationResult?.hasErrors) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Commands',
        detail:
          this.commandValidationResult.errorMessage ??
          'Commands would cause an error',
        life: 5000,
      });
      return;
    }

    // Warn about collisions but allow execution
    if (
      this.commandValidationResult?.collisions &&
      this.commandValidationResult.collisions.length > 0
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Collision Warning',
        detail: 'These commands may cause collisions with other drones',
        life: 5000,
      });
    }

    const droneId = this.selectedDrone.id;
    const commands = this.commandsText
      .toUpperCase()
      .split('')
      .map((char) => this.mapCommand(char))
      .filter((cmd): cmd is string => !!cmd);

    if (commands.length === 0) return;

    this.executingSingle = true;

    // Store initial position for history
    const initialPosition = `(${this.selectedDrone.x}, ${
      this.selectedDrone.y
    }) ${this.getOrientationLabel(this.selectedDrone.orientation)}`;

    this.flightService
      .sendCommands(droneId, commands)
      .pipe(finalize(() => (this.executingSingle = false)))
      .subscribe({
        next: (updatedDrone) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Commands executed',
            detail: `Drone moved to (${updatedDrone.x}, ${updatedDrone.y})`,
          });

          // Add to flight history
          this.addToFlightHistory(
            updatedDrone.name || `Drone ${updatedDrone.id}`,
            this.commandsText,
            initialPosition,
            `(${updatedDrone.x}, ${updatedDrone.y}) ${this.getOrientationLabel(
              updatedDrone.orientation
            )}`,
            'Completed'
          );

          this.refreshDronesAndMatrix();
          this.commandsText = '';
          this.commandValidationResult = undefined;
        },
        error: (err) => {
          console.error(`Error sending commands to drone ${droneId}:`, err);
          this.messageService.add({
            severity: 'error',
            summary: 'Failed to execute commands',
            detail: err.message || 'An error occurred while executing commands',
          });

          // Add to flight history with failed status
          this.addToFlightHistory(
            this.selectedDrone?.name ?? `Drone ${droneId}`,
            this.commandsText,
            initialPosition,
            'N/A',
            'Failed'
          );
        },
      });
  }

  executeGroup(): void {
    if (this.multiSelectedDrones.length === 0 || !this.commandsGroupText)
      return;

    if (!this.validateCommandFormat(this.commandsGroupText)) {
      this.commandsGroupTextInvalid = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Commands',
        detail: 'Commands must only contain A, L, and R characters',
        life: 5000,
      });
      return;
    }

    // Validate group commands before execution
    this.validateGroupCommands();

    if (this.hasGroupValidationErrors()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Group Commands',
        detail: 'Some drones would move out of bounds or cause errors',
        life: 5000,
      });
      return;
    }

    // Warn about collisions but allow execution
    if (this.hasGroupCollisions()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Collision Warning',
        detail: 'These commands may cause collisions between drones',
        life: 5000,
      });
    }

    const commands = this.commandsGroupText
      .toUpperCase()
      .split('')
      .map((char) => this.mapCommand(char))
      .filter((cmd): cmd is string => cmd !== null);

    if (commands.length === 0) return;

    const droneIds = this.multiSelectedDrones.map((d) => d.id);

    // Store initial positions for history
    const initialPositions = this.multiSelectedDrones
      .map(
        (drone) =>
          `${drone.name || `Drone ${drone.id}`}: (${drone.x}, ${
            drone.y
          }) ${this.getOrientationLabel(drone.orientation)}`
      )
      .join(', ');

    this.executingGroup = true;

    this.flightService
      .sendCommandsToMany(droneIds, commands)
      .pipe(finalize(() => (this.executingGroup = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Commands sent to selected drones',
            detail: `${droneIds.length} drones updated successfully`,
          });

          // Add to flight history
          this.addToFlightHistory(
            `Group (${droneIds.length} drones)`,
            this.commandsGroupText,
            initialPositions,
            'Multiple positions updated',
            'Completed'
          );

          this.refreshDronesAndMatrix();
          this.commandsGroupText = '';
          this.groupValidationResults.clear();
          this.groupCollisions = [];
        },
        error: (err) => {
          console.error('Error sending commands to group:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Failed to execute group commands',
            detail:
              err.message || 'An error occurred while executing group commands',
          });

          // Add to flight history with failed status
          this.addToFlightHistory(
            `Group (${droneIds.length} drones)`,
            this.commandsGroupText,
            initialPositions,
            'N/A',
            'Failed'
          );
        },
      });
  }

  executeBatch(): void {
    if (this.batchCommands.length === 0) return;

    // Validate all batch commands
    for (let i = 0; i < this.batchCommands.length; i++) {
      this.validateBatchCommand(i);
    }

    // Check for validation errors
    if (this.hasBatchValidationErrors()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Batch Commands',
        detail: 'Some commands would move drones out of bounds or cause errors',
        life: 5000,
      });
      return;
    }

    // Warn about collisions but allow execution
    if (this.hasBatchCollisions()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Collision Warning',
        detail: 'These batch commands may cause collisions between drones',
        life: 5000,
      });
    }

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

    // Store initial positions for history
    const droneIds = batchPayload.map((b) => b.droneId);
    const batchDrones = this.drones.filter((d) => droneIds.includes(d.id));
    const initialPositions = batchDrones
      .map(
        (drone) =>
          `${drone.name || `Drone ${drone.id}`}: (${drone.x}, ${
            drone.y
          }) ${this.getOrientationLabel(drone.orientation)}`
      )
      .join(', ');

    this.executingBatch = true;

    this.flightService
      .sendBatchCommands(batchPayload)
      .pipe(finalize(() => (this.executingBatch = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Batch commands executed',
            detail: `${batchPayload.length} command sequences executed successfully`,
          });

          // Add to flight history
          this.addToFlightHistory(
            `Batch (${batchPayload.length} sequences)`,
            batchPayload
              .map((b) => `Drone ${b.droneId}: ${b.commands.join('')}`)
              .join(', '),
            initialPositions,
            'Multiple positions updated',
            'Completed'
          );

          this.refreshDronesAndMatrix();
          this.batchCommands = [];
          this.addBatchCommand();
          this.batchCollisions = [];
        },
        error: (err) => {
          console.error('Error executing batch commands:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Failed to execute batch',
            detail:
              err.message || 'An error occurred while executing batch commands',
          });

          // Add to flight history with failed status
          this.addToFlightHistory(
            `Batch (${batchPayload.length} sequences)`,
            batchPayload
              .map((b) => `Drone ${b.droneId}: ${b.commands.join('')}`)
              .join(', '),
            initialPositions,
            'N/A',
            'Failed'
          );
        },
      });
  }

  isBatchCommandInvalid(commands: string): boolean {
    return commands.length > 0 && !this.validateCommandFormat(commands);
  }

  isValidBatch(): boolean {
    if (this.batchCommands.length === 0) return false;
    return this.batchCommands.some(
      (b) =>
        b.droneId !== null &&
        b.commands.length > 0 &&
        this.validateCommandFormat(b.commands)
    );
  }

  addBatchCommand(): void {
    this.batchCommands.push({ droneId: null, commands: '' });
  }

  removeBatchCommand(index: number): void {
    if (index >= 0 && index < this.batchCommands.length) {
      this.batchCommands.splice(index, 1);
      // If no batch commands left, add an empty one
      if (this.batchCommands.length === 0) {
        this.addBatchCommand();
      }
      // Revalidate batch collisions
      this.validateBatchCollisions();
    }
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

  mapCommand(char: string): string | null {
    const commandMap: Record<string, string> = {
      A: 'MOVE_FORWARD',
      L: 'TURN_LEFT',
      R: 'TURN_RIGHT',
    };
    return commandMap[char.toUpperCase()] ?? null;
  }

  initializeMatrixOptions(): void {
    this.matrixOptions = this.matrices.map((matrix) => ({
      label: `Matrix ${matrix.id} (${matrix.maxX}x${matrix.maxY})`,
      value: matrix.id,
    }));

    // If we have matrices, select the first one by default
    if (this.matrixOptions.length > 0) {
      this.selectedMatrixId = this.matrixOptions[0].value;
      this.onMatrixSelect();
    }
  }

  onMatrixSelect(): void {
    if (!this.selectedMatrixId) {
      this.selectedMatrix = undefined;
      this.droneOptions = [];
      return;
    }

    const matrix = this.matrices.find((m) => m.id === this.selectedMatrixId);
    if (matrix) {
      this.selectedMatrix = matrix;

      // Update drone options for this matrix
      this.droneOptions = matrix.drones.map((drone) => ({
        label: drone.name || `Drone ${drone.id}`,
        value: drone.id,
      }));

      // Clear selected drone if it's not in this matrix
      if (
        this.selectedDroneId &&
        !matrix.drones.some((d) => d.id === this.selectedDroneId)
      ) {
        this.selectedDroneId = undefined;
        this.selectedDrone = undefined;
        this.commandValidationResult = undefined;
      }

      // Clear multi-selected drones that aren't in this matrix
      this.multiSelectedDroneIds = this.multiSelectedDroneIds.filter((id) =>
        matrix.drones.some((d) => d.id === id)
      );
      this.updateMultiSelectedDrones();

      // Revalidate commands if needed
      if (this.selectedDrone && this.commandsText) {
        this.validateCommands();
      }

      if (this.multiSelectedDrones.length > 0 && this.commandsGroupText) {
        this.validateGroupCommands();
      }

      for (let i = 0; i < this.batchCommands.length; i++) {
        this.validateBatchCommand(i);
      }
    }
  }

  updateMultiSelectedDrones(): void {
    this.multiSelectedDrones = this.drones.filter((d) =>
      this.multiSelectedDroneIds.includes(d.id)
    );

    // Revalidate group commands if needed
    if (this.multiSelectedDrones.length > 0 && this.commandsGroupText) {
      this.validateGroupCommands();
    }
  }
}
