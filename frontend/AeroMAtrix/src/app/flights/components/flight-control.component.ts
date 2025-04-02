import { CommonModule } from '@angular/common';
import {
  Component,
  type ElementRef,
  type OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
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
  ],
  providers: [MessageService],
  template: `
    <p-card styleClass="flight-control-card">
      <h2 class="mb-4">Flight Control</h2>

      <div *ngIf="loading" class="flex justify-content-center my-5">
        <p-progressSpinner
          strokeWidth="4"
          aria-label="Loading drones"
        ></p-progressSpinner>
      </div>

      <div *ngIf="!loading" class="grid">
        <!-- Matrix Visualization -->
        <div class="col-12 lg:col-5">
          <div class="matrix-container p-3 border-round shadow-2">
            <h3>Matrix Visualization</h3>
            <p *ngIf="!selectedMatrix" class="text-center p-3">
              Select a drone to visualize its matrix
            </p>
            <div *ngIf="selectedMatrix" class="matrix-visualization">
              <div class="matrix-info mb-3">
                <p-chip
                  [label]="
                    'Matrix ' +
                    selectedMatrix.id +
                    ' (' +
                    selectedMatrix.maxX +
                    'x' +
                    selectedMatrix.maxY +
                    ')'
                  "
                  styleClass="mr-2"
                ></p-chip>
                <p-chip
                  *ngIf="selectedMatrix.drones.length > 0"
                  [label]="selectedMatrix.drones.length + ' drones'"
                  styleClass="bg-primary"
                ></p-chip>
              </div>

              <div class="matrix-grid" #matrixGrid>
                <!-- Matrix grid will be rendered here -->
              </div>

              <div class="matrix-legend mt-3">
                <div class="flex align-items-center gap-2 mb-2">
                  <div class="legend-item drone-cell"></div>
                  <span>Drone</span>
                </div>
                <div class="flex align-items-center gap-2 mb-2">
                  <div class="legend-item selected-drone-cell"></div>
                  <span>Selected Drone</span>
                </div>
                <div class="flex align-items-center gap-2">
                  <div class="legend-item empty-cell"></div>
                  <span>Empty Cell</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Flight Controls -->
        <div class="col-12 lg:col-7">
          <p-tabView>
            <!-- SINGLE DRONE COMMANDS -->
            <p-tabPanel header="Single Drone">
              <div class="p-fluid">
                <div class="field">
                  <label class="font-bold">Drone</label>
                  <p-dropdown
                    [options]="drones"
                    [(ngModel)]="selectedDrone"
                    optionLabel="name"
                    placeholder="Select a drone"
                    [filter]="true"
                    filterBy="name"
                    [showClear]="true"
                    styleClass="w-full"
                    (onChange)="onDroneSelect($event)"
                  >
                    <ng-template pTemplate="selectedItem">
                      <div
                        *ngIf="selectedDrone"
                        class="flex align-items-center gap-2"
                      >
                        <span>{{ selectedDrone.name }}</span>
                        <p-chip
                          [label]="
                            '(' + selectedDrone.x + ',' + selectedDrone.y + ')'
                          "
                          [removable]="false"
                          styleClass="p-chip-sm"
                        ></p-chip>
                        <p-chip
                          [label]="
                            getOrientationLabel(selectedDrone.orientation)
                          "
                          [removable]="false"
                          styleClass="p-chip-sm"
                          [style]="
                            getOrientationStyle(selectedDrone.orientation)
                          "
                        ></p-chip>
                      </div>
                    </ng-template>
                    <ng-template let-drone pTemplate="item">
                      <div class="flex align-items-center gap-2">
                        <span>{{ drone.name }}</span>
                        <p-chip
                          [label]="'(' + drone.x + ',' + drone.y + ')'"
                          [removable]="false"
                          styleClass="p-chip-sm"
                        ></p-chip>
                        <p-chip
                          [label]="getOrientationLabel(drone.orientation)"
                          [removable]="false"
                          styleClass="p-chip-sm"
                          [style]="getOrientationStyle(drone.orientation)"
                        ></p-chip>
                      </div>
                    </ng-template>
                  </p-dropdown>
                </div>

                <div class="field mt-3">
                  <label class="font-bold">Commands</label>
                  <div class="p-inputgroup">
                    <input
                      type="text"
                      pInputText
                      [(ngModel)]="commandsText"
                      placeholder="Ex: AIAAD"
                      [ngClass]="{ 'ng-invalid': commandsTextInvalid }"
                      aria-describedby="commands-help"
                    />
                    <button
                      pButton
                      type="button"
                      icon="pi pi-question-circle"
                      pTooltip="A = Advance, L = Turn Left, R = Turn Right"
                      tooltipPosition="left"
                      class="p-button-info"
                    ></button>
                  </div>
                  <small
                    id="commands-help"
                    *ngIf="commandsTextInvalid"
                    class="p-error"
                  >
                    Invalid commands. Use only A (Advance), L (Left), R (Right)
                  </small>
                </div>

                <div class="command-buttons flex gap-2 mt-3">
                  <button
                    pButton
                    label="A"
                    class="p-button-rounded p-button-sm"
                    pTooltip="Advance"
                    (click)="addCommand('A')"
                  ></button>
                  <button
                    pButton
                    label="L"
                    class="p-button-rounded p-button-sm p-button-secondary"
                    pTooltip="Turn Left"
                    (click)="addCommand('L')"
                  ></button>
                  <button
                    pButton
                    label="R"
                    class="p-button-rounded p-button-sm p-button-secondary"
                    pTooltip="Turn Right"
                    (click)="addCommand('R')"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-sm p-button-danger"
                    pTooltip="Clear"
                    (click)="clearCommands()"
                  ></button>
                </div>

                <button
                  pButton
                  label="Execute"
                  icon="pi pi-play"
                  class="mt-3"
                  (click)="executeSingle()"
                  [disabled]="
                    !selectedDrone || !commandsText || executingSingle
                  "
                  [loading]="executingSingle"
                ></button>
              </div>
            </p-tabPanel>

            <!-- MULTIPLE DRONES - SAME COMMANDS -->
            <p-tabPanel header="Multiple Drones - Same Commands">
              <div class="p-fluid">
                <div class="field">
                  <label class="font-bold">Drones</label>
                  <p-multiSelect
                    [options]="drones"
                    [(ngModel)]="multiSelectedDrones"
                    optionLabel="name"
                    placeholder="Select drones"
                    [filter]="true"
                    filterBy="name"
                    display="chip"
                    styleClass="w-full"
                  >
                    <ng-template let-drone pTemplate="item">
                      <div class="flex align-items-center gap-2">
                        <span>{{ drone.name }}</span>
                        <p-chip
                          [label]="'(' + drone.x + ',' + drone.y + ')'"
                          [removable]="false"
                          styleClass="p-chip-sm"
                        ></p-chip>
                      </div>
                    </ng-template>
                  </p-multiSelect>
                </div>

                <div class="field mt-3">
                  <label class="font-bold">Commands</label>
                  <div class="p-inputgroup">
                    <input
                      type="text"
                      pInputText
                      [(ngModel)]="commandsGroupText"
                      placeholder="Ex: RRALA"
                      [ngClass]="{ 'ng-invalid': commandsGroupTextInvalid }"
                      aria-describedby="group-commands-help"
                    />
                    <button
                      pButton
                      type="button"
                      icon="pi pi-question-circle"
                      pTooltip="A = Advance, L = Turn Left, R = Turn Right"
                      tooltipPosition="left"
                      class="p-button-info"
                    ></button>
                  </div>
                  <small
                    id="group-commands-help"
                    *ngIf="commandsGroupTextInvalid"
                    class="p-error"
                  >
                    Invalid commands. Use only A (Advance), L (Left), R (Right)
                  </small>
                </div>

                <div class="command-buttons flex gap-2 mt-3">
                  <button
                    pButton
                    label="A"
                    class="p-button-rounded p-button-sm"
                    pTooltip="Advance"
                    (click)="addGroupCommand('A')"
                  ></button>
                  <button
                    pButton
                    label="L"
                    class="p-button-rounded p-button-sm p-button-secondary"
                    pTooltip="Turn Left"
                    (click)="addGroupCommand('L')"
                  ></button>
                  <button
                    pButton
                    label="R"
                    class="p-button-rounded p-button-sm p-button-secondary"
                    pTooltip="Turn Right"
                    (click)="addGroupCommand('R')"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-sm p-button-danger"
                    pTooltip="Clear"
                    (click)="clearGroupCommands()"
                  ></button>
                </div>

                <button
                  pButton
                  label="Execute Group"
                  icon="pi pi-play"
                  class="mt-3"
                  (click)="executeGroup()"
                  [disabled]="
                    !multiSelectedDrones.length ||
                    !commandsGroupText ||
                    executingGroup
                  "
                  [loading]="executingGroup"
                ></button>
              </div>
            </p-tabPanel>

            <!-- DIFFERENT SEQUENCES PER DRONE -->
            <p-tabPanel header="Different Sequences Per Drone">
              <div
                *ngFor="let item of batchCommands; let i = index"
                class="mb-4 p-fluid"
              >
                <div class="flex align-items-start gap-2">
                  <div class="flex-grow-1">
                    <div class="field">
                      <label class="font-bold">Drone</label>
                      <p-dropdown
                        [options]="drones"
                        [(ngModel)]="item.droneId"
                        optionLabel="name"
                        placeholder="Select drone"
                        [filter]="true"
                        filterBy="name"
                        styleClass="w-full"
                      >
                        <ng-template let-drone pTemplate="item">
                          <div class="flex align-items-center gap-2">
                            <span>{{ drone.name }}</span>
                            <p-chip
                              [label]="'(' + drone.x + ',' + drone.y + ')'"
                              [removable]="false"
                              styleClass="p-chip-sm"
                            ></p-chip>
                          </div>
                        </ng-template>
                      </p-dropdown>
                    </div>

                    <div class="field mt-2">
                      <label class="font-bold">Commands</label>
                      <div class="p-inputgroup">
                        <input
                          type="text"
                          pInputText
                          [(ngModel)]="item.commands"
                          placeholder="Ex: AALRR"
                          [ngClass]="{
                            'ng-invalid': isBatchCommandInvalid(item.commands)
                          }"
                        />
                        <button
                          pButton
                          type="button"
                          icon="pi pi-question-circle"
                          pTooltip="A = Advance, L = Turn Left, R = Turn Right"
                          tooltipPosition="left"
                          class="p-button-info"
                        ></button>
                      </div>
                      <small
                        *ngIf="isBatchCommandInvalid(item.commands)"
                        class="p-error"
                      >
                        Invalid commands. Use only A (Advance), L (Left), R
                        (Right)
                      </small>
                    </div>
                  </div>

                  <button
                    pButton
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger p-button-outlined mt-4"
                    (click)="batchCommands.splice(i, 1)"
                    pTooltip="Remove"
                  ></button>
                </div>

                <p-divider *ngIf="i < batchCommands.length - 1"></p-divider>
              </div>

              <div class="flex gap-2 mt-4">
                <button
                  pButton
                  label="Add Row"
                  icon="pi pi-plus"
                  class="p-button-outlined"
                  (click)="addBatchCommand()"
                ></button>
                <button
                  pButton
                  label="Execute Batch"
                  icon="pi pi-play"
                  (click)="executeBatch()"
                  [disabled]="!isValidBatch() || executingBatch"
                  [loading]="executingBatch"
                ></button>
              </div>
            </p-tabPanel>
          </p-tabView>
        </div>
      </div>
    </p-card>

    <p-toast></p-toast>
  `,
  styles: [
    `
      .matrix-container {
        background-color: var(--surface-card);
        height: 100%;
      }

      .matrix-grid {
        display: grid;
        gap: 2px;
        margin: 0 auto;
        max-width: 100%;
        overflow: auto;
      }

      .matrix-cell {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--surface-border);
        background-color: var(--surface-ground);
        position: relative;
      }

      .drone-cell {
        background-color: var(--primary-color);
        color: var(--primary-color-text);
      }

      .selected-drone-cell {
        background-color: var(--primary-800);
        color: var(--primary-color-text);
        box-shadow: 0 0 0 2px var(--primary-color);
        animation: pulse 1.5s infinite;
      }

      .drone-direction {
        position: absolute;
        font-size: 1.2rem;
      }

      .legend-item {
        width: 20px;
        height: 20px;
        border: 1px solid var(--surface-border);
      }

      .empty-cell {
        background-color: var(--surface-ground);
      }

      .command-buttons {
        display: flex;
        flex-wrap: wrap;
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }

      @media screen and (max-width: 768px) {
        .matrix-cell {
          width: 30px;
          height: 30px;
          font-size: 0.8rem;
        }
      }
    `,
  ],
})
export class FlightControlComponent implements OnInit {
  @ViewChild('matrixGrid') matrixGridRef!: ElementRef;

  drones: Drone[] = [];
  matrices: Matrix[] = [];
  loading = true;

  // Single drone mode
  selectedDrone?: Drone;
  selectedMatrix?: Matrix;
  commandsText = '';
  commandsTextInvalid = false;
  executingSingle = false;

  // Group mode
  multiSelectedDrones: Drone[] = [];
  commandsGroupText = '';
  commandsGroupTextInvalid = false;
  executingGroup = false;

  // Batch mode
  batchCommands: { droneId: number | null; commands: string }[] = [];
  executingBatch = false;

  constructor(
    private droneService: DroneService,
    private matrixService: MatrixService,
    private flightService: FlightService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDrones();
    this.loadMatrices();
    this.addBatchCommand(); // Start with one row
  }

  loadDrones() {
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

  loadMatrices() {
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

  onDroneSelect(event: any) {
    if (this.selectedDrone) {
      this.loadMatrixForDrone(this.selectedDrone.matrixId);
    } else {
      this.selectedMatrix = undefined;
    }
  }

  loadMatrixForDrone(matrixId: number) {
    const matrix = this.matrices.find((m) => m.id === matrixId);
    if (matrix) {
      this.selectedMatrix = matrix;
      setTimeout(() => this.renderMatrix(), 0);
    }
  }

  renderMatrix() {
    if (!this.selectedMatrix || !this.matrixGridRef) return;

    const grid = this.matrixGridRef.nativeElement;
    grid.innerHTML = '';

    // Set grid dimensions
    grid.style.gridTemplateColumns = `repeat(${
      this.selectedMatrix.maxX + 1
    }, 40px)`;
    grid.style.gridTemplateRows = `repeat(${
      this.selectedMatrix.maxY + 1
    }, 40px)`;

    // Add coordinate labels first (top row and leftmost column)
    // Top row (X coordinates)
    for (let x = 0; x <= this.selectedMatrix.maxX; x++) {
      const cell = document.createElement('div');
      cell.className = 'matrix-cell';
      cell.style.backgroundColor = 'var(--surface-200)';

      if (x > 0) {
        cell.textContent = (x - 1).toString();
      }

      grid.appendChild(cell);
    }

    // Create the grid cells with Y coordinates
    for (let y = 0; y < this.selectedMatrix.maxY; y++) {
      // Y coordinate label
      const yLabel = document.createElement('div');
      yLabel.className = 'matrix-cell';
      yLabel.style.backgroundColor = 'var(--surface-200)';
      yLabel.textContent = y.toString();
      grid.appendChild(yLabel);

      // Create cells for this row
      for (let x = 0; x < this.selectedMatrix.maxX; x++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';
        cell.dataset['x'] = x.toString();
        cell.dataset['y'] = y.toString();

        // Check if there's a drone at this position
        const drone = this.selectedMatrix.drones.find(
          (d) => d.x === x && d.y === y
        );
        if (drone) {
          cell.classList.add('drone-cell');

          // If this is the selected drone, highlight it
          if (this.selectedDrone && drone.id === this.selectedDrone.id) {
            cell.classList.add('selected-drone-cell');
          }

          // Add direction indicator
          const directionIndicator = document.createElement('span');
          directionIndicator.className = 'drone-direction';

          // Set direction arrow based on orientation
          switch (drone.orientation) {
            case 'N':
              directionIndicator.textContent = '↑';
              break;
            case 'S':
              directionIndicator.textContent = '↓';
              break;
            case 'E':
              directionIndicator.textContent = '→';
              break;
            case 'W':
            case 'O':
              directionIndicator.textContent = '←';
              break; // Handle legacy 'O' for Oeste
          }

          cell.appendChild(directionIndicator);
          cell.title = `${drone.name} (${drone.x},${
            drone.y
          }) - ${this.getOrientationLabel(drone.orientation)}`;
        }

        grid.appendChild(cell);
      }
    }
  }

  validateCommands(commands: string): boolean {
    return /^[ALR]+$/i.test(commands);
  }

  addCommand(command: string) {
    this.commandsText += command;
    this.commandsTextInvalid = false;
  }

  clearCommands() {
    this.commandsText = '';
    this.commandsTextInvalid = false;
  }

  addGroupCommand(command: string) {
    this.commandsGroupText += command;
    this.commandsGroupTextInvalid = false;
  }

  clearGroupCommands() {
    this.commandsGroupText = '';
    this.commandsGroupTextInvalid = false;
  }

  executeSingle() {
    if (!this.validateCommands(this.commandsText)) {
      this.commandsTextInvalid = true;
      return;
    }

    this.commandsTextInvalid = false;
    this.executingSingle = true;

    // Convert legacy commands (I/D) to new format (L/R)
    const commands = this.commandsText
      .toUpperCase()
      .replace(/I/g, 'L') // Replace I (Izquierda) with L (Left)
      .replace(/D/g, 'R') // Replace D (Derecha) with R (Right)
      .split('');

    this.flightService
      .sendCommands(this.selectedDrone!.id, commands)
      .subscribe({
        next: (drone) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Commands Executed',
            detail: `New position: (${drone.x}, ${
              drone.y
            }) - Orientation: ${this.getOrientationLabel(drone.orientation)}`,
            life: 3000,
          });
          this.executingSingle = false;
          this.loadDrones();

          // Update the selected drone with new position
          this.selectedDrone = drone;

          // Re-render the matrix
          if (this.selectedMatrix) {
            this.loadMatrixForDrone(this.selectedDrone.matrixId);
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message || 'Flight failed',
            life: 5000,
          });
          this.executingSingle = false;
        },
      });
  }

  executeGroup() {
    if (!this.validateCommands(this.commandsGroupText)) {
      this.commandsGroupTextInvalid = true;
      return;
    }

    this.commandsGroupTextInvalid = false;
    this.executingGroup = true;
    const droneIds = this.multiSelectedDrones.map((d) => d.id);

    // Convert legacy commands (I/D) to new format (L/R)
    const commands = this.commandsGroupText
      .toUpperCase()
      .replace(/I/g, 'L') // Replace I (Izquierda) with L (Left)
      .replace(/D/g, 'R') // Replace D (Derecha) with R (Right)
      .split('');

    this.flightService.sendCommandsToMany(droneIds, commands).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Commands Sent to Group',
          detail: `Drones: ${droneIds.join(', ')}`,
          life: 3000,
        });
        this.executingGroup = false;
        this.loadDrones();

        // Re-render the matrix if needed
        if (this.selectedMatrix) {
          this.loadMatrixForDrone(this.selectedMatrix.id);
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Group Error',
          detail: err.message || 'Flight failed',
          life: 5000,
        });
        this.executingGroup = false;
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

  addBatchCommand() {
    this.batchCommands.push({ droneId: null, commands: '' });
  }

  executeBatch() {
    if (!this.isValidBatch()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please complete at least one row correctly',
        life: 3000,
      });
      return;
    }

    this.executingBatch = true;
    const batch = this.batchCommands
      .filter(
        (b) => b.droneId && b.commands && this.validateCommands(b.commands)
      )
      .map((b) => ({
        droneId: b.droneId!,
        commands: b.commands
          .toUpperCase()
          .replace(/I/g, 'L') // Replace I (Izquierda) with L (Left)
          .replace(/D/g, 'R') // Replace D (Derecha) with R (Right)
          .split(''),
      }));

    this.flightService.sendBatchCommands(batch).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Batch Commands Sent',
          detail: `Total drones: ${batch.length}`,
          life: 3000,
        });
        this.executingBatch = false;
        this.batchCommands = [{ droneId: null, commands: '' }];
        this.loadDrones();

        // Re-render the matrix if needed
        if (this.selectedMatrix) {
          this.loadMatrixForDrone(this.selectedMatrix.id);
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Batch Error',
          detail: err.message || 'Batch failed',
          life: 5000,
        });
        this.executingBatch = false;
      },
    });
  }

  getOrientationLabel(orientation: string): string {
    const labels = {
      N: 'North',
      S: 'South',
      E: 'East',
      W: 'West',
      O: 'West', // Handle legacy 'O' for Oeste (West in Spanish)
    };
    return labels[orientation as keyof typeof labels] || orientation;
  }

  getOrientationStyle(orientation: string): any {
    const styles = {
      N: { backgroundColor: 'var(--green-500)' },
      S: { backgroundColor: 'var(--yellow-500)' },
      E: { backgroundColor: 'var(--blue-500)' },
      W: { backgroundColor: 'var(--purple-500)' },
      O: { backgroundColor: 'var(--purple-500)' }, // Handle legacy 'O'
    };
    return styles[orientation as keyof typeof styles] || {};
  }
}
