import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  type ElementRef,
  type OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
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
    RippleModule,
    BadgeModule,
  ],
  providers: [MessageService],
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
    trigger('matrixFadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate(
          '500ms 200ms ease-out',
          style({ opacity: 1, transform: 'scale(1)' })
        ),
      ]),
    ]),
    trigger('droneMove', [
      transition(':increment', [
        style({ transform: 'translateY(0)' }),
        animate('300ms ease-out', style({ transform: 'translateY(-10px)' })),
        animate('300ms ease-in', style({ transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="flight-control-container" @fadeIn>
      <div class="page-header">
        <h1>Flight Control Center</h1>
        <p>Control and monitor drone movements in real-time</p>
      </div>

      <div *ngIf="loading" class="loading-container">
        <p-progressSpinner
          strokeWidth="4"
          aria-label="Loading drones"
        ></p-progressSpinner>
        <span>Loading flight control system...</span>
      </div>

      <div *ngIf="!loading" class="grid">
        <!-- Matrix Visualization -->
        <div class="col-12 lg:col-5">
          <p-card styleClass="matrix-card">
            <ng-template pTemplate="title">
              <div class="card-title">
                <i class="pi pi-map"></i>
                <span>Matrix Visualization</span>
              </div>
            </ng-template>

            <div class="matrix-container">
              <p *ngIf="!selectedMatrix" class="empty-matrix-message">
                <i class="pi pi-info-circle"></i>
                Select a drone to visualize its matrix
              </p>

              <div
                *ngIf="selectedMatrix"
                class="matrix-visualization"
                @matrixFadeIn
              >
                <div class="matrix-header">
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
                    icon="pi pi-th-large"
                  ></p-chip>
                  <p-badge
                    *ngIf="selectedMatrix.drones.length > 0"
                    [value]="selectedMatrix.drones.length + ' drones'"
                    severity="info"
                  ></p-badge>
                </div>

                <div class="matrix-grid-container">
                  <div
                    class="matrix-grid"
                    #matrixGrid
                    [@droneMove]="droneAnimationTrigger"
                  >
                    <!-- Matrix grid will be rendered here -->
                  </div>
                </div>

                <div class="matrix-legend">
                  <div class="legend-item">
                    <div class="legend-color drone-cell"></div>
                    <span>Drone</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color selected-drone-cell"></div>
                    <span>Selected Drone</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color empty-cell"></div>
                    <span>Empty Cell</span>
                  </div>
                </div>
              </div>
            </div>
          </p-card>
        </div>

        <!-- Flight Controls -->
        <div class="col-12 lg:col-7">
          <p-tabView styleClass="flight-tabs">
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
                      pRipple
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

                <div class="command-buttons">
                  <button
                    pButton
                    pRipple
                    label="A"
                    class="p-button-rounded p-button-lg"
                    pTooltip="Advance"
                    tooltipPosition="top"
                    (click)="addCommand('A')"
                  ></button>
                  <button
                    pButton
                    pRipple
                    label="L"
                    class="p-button-rounded p-button-lg p-button-secondary"
                    pTooltip="Turn Left"
                    tooltipPosition="top"
                    (click)="addCommand('L')"
                  ></button>
                  <button
                    pButton
                    pRipple
                    label="R"
                    class="p-button-rounded p-button-lg p-button-secondary"
                    pTooltip="Turn Right"
                    tooltipPosition="top"
                    (click)="addCommand('R')"
                  ></button>
                  <button
                    pButton
                    pRipple
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-lg p-button-danger"
                    pTooltip="Clear"
                    tooltipPosition="top"
                    (click)="clearCommands()"
                  ></button>
                </div>

                <button
                  pButton
                  pRipple
                  label="Execute"
                  icon="pi pi-play"
                  class="execute-button"
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
                      pRipple
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

                <div class="command-buttons">
                  <button
                    pButton
                    pRipple
                    label="A"
                    class="p-button-rounded p-button-lg"
                    pTooltip="Advance"
                    tooltipPosition="top"
                    (click)="addGroupCommand('A')"
                  ></button>
                  <button
                    pButton
                    pRipple
                    label="L"
                    class="p-button-rounded p-button-lg p-button-secondary"
                    pTooltip="Turn Left"
                    tooltipPosition="top"
                    (click)="addGroupCommand('L')"
                  ></button>
                  <button
                    pButton
                    pRipple
                    label="R"
                    class="p-button-rounded p-button-lg p-button-secondary"
                    pTooltip="Turn Right"
                    tooltipPosition="top"
                    (click)="addGroupCommand('R')"
                  ></button>
                  <button
                    pButton
                    pRipple
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-lg p-button-danger"
                    pTooltip="Clear"
                    tooltipPosition="top"
                    (click)="clearGroupCommands()"
                  ></button>
                </div>

                <button
                  pButton
                  pRipple
                  label="Execute Group"
                  icon="pi pi-play"
                  class="execute-button"
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
                class="batch-command-row"
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
                          pRipple
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
                    pRipple
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger p-button-outlined"
                    (click)="batchCommands.splice(i, 1)"
                    pTooltip="Remove"
                  ></button>
                </div>

                <p-divider *ngIf="i < batchCommands.length - 1"></p-divider>
              </div>

              <div class="batch-actions">
                <button
                  pButton
                  pRipple
                  label="Add Row"
                  icon="pi pi-plus"
                  class="p-button-outlined"
                  (click)="addBatchCommand()"
                ></button>
                <button
                  pButton
                  pRipple
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
    </div>

    <p-toast></p-toast>
  `,
  styles: [
    `
      .flight-control-container {
        padding: 1rem;
      }

      .page-header {
        margin-bottom: 2rem;
      }

      .page-header h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        color: var(--text-color);
      }

      .page-header p {
        color: var(--text-color-secondary);
        font-size: 1.1rem;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 3rem;
      }

      .loading-container span {
        color: var(--text-color-secondary);
      }

      /* Matrix Card Styling */
      :host ::ng-deep .matrix-card .p-card-body {
        padding: 0;
      }

      :host ::ng-deep .matrix-card .p-card-content {
        padding: 0;
      }

      .card-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--surface-border);
      }

      .card-title i {
        color: var(--primary-color);
      }

      .matrix-container {
        padding: 1.5rem;
        min-height: 400px;
        display: flex;
        flex-direction: column;
      }

      .empty-matrix-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        height: 100%;
        color: var(--text-color-secondary);
        font-size: 1.1rem;
        text-align: center;
        padding: 2rem;
      }

      .empty-matrix-message i {
        font-size: 2rem;
        color: var(--surface-400);
      }

      .matrix-header {
        display: flex;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      .matrix-grid-container {
        overflow: auto;
        margin-bottom: 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--surface-border);
        background-color: var(--surface-ground);
        padding: 1rem;
      }

      .matrix-grid {
        display: grid;
        gap: 2px;
        margin: 0 auto;
        max-width: 100%;
      }

      .matrix-cell {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--surface-border);
        background-color: var(--surface-card);
        position: relative;
        transition: all 0.3s ease;
      }

      .drone-cell {
        background-color: var(--primary-500);
        color: var(--primary-color-text);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }

      .selected-drone-cell {
        background-color: var(--primary-700);
        color: var(--primary-color-text);
        box-shadow: 0 0 0 2px var(--primary-300), 0 4px 8px rgba(0, 0, 0, 0.2);
        animation: pulse 1.5s infinite;
        z-index: 1;
      }

      .drone-direction {
        position: absolute;
        font-size: 1.2rem;
        font-weight: bold;
      }

      .matrix-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .legend-color {
        width: 20px;
        height: 20px;
        border: 1px solid var(--surface-border);
        border-radius: 4px;
      }

      .empty-cell {
        background-color: var(--surface-card);
      }

      /* Flight Controls Styling */
      :host ::ng-deep .flight-tabs .p-tabview-nav {
        border-radius: 8px 8px 0 0;
        background-color: var(--surface-ground);
        padding: 0 1rem;
      }

      :host ::ng-deep .flight-tabs .p-tabview-nav li .p-tabview-nav-link {
        padding: 1rem 1.25rem;
        font-weight: 600;
      }

      :host ::ng-deep .flight-tabs .p-tabview-panels {
        padding: 1.5rem;
        background-color: var(--surface-card);
        border-radius: 0 0 8px 8px;
        border: 1px solid var(--surface-border);
        border-top: none;
      }

      .command-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin: 1.5rem 0;
      }

      .execute-button {
        margin-top: 1rem;
        padding: 1rem;
        font-weight: 600;
      }

      .batch-command-row {
        background-color: var(--surface-hover);
        border-radius: 8px;
        padding: 1.25rem;
        margin-bottom: 1rem;
      }

      .batch-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
      }

      /* Animations */
      @keyframes pulse {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 2px var(--primary-300), 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        50% {
          transform: scale(1.05);
          box-shadow: 0 0 0 3px var(--primary-300),
            0 6px 12px rgba(0, 0, 0, 0.25);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 0 0 2px var(--primary-300), 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      }

      /* Responsive Adjustments */
      @media screen and (max-width: 768px) {
        .matrix-cell {
          width: 30px;
          height: 30px;
          font-size: 0.8rem;
        }

        .batch-actions {
          flex-direction: column;
        }

        .batch-actions button {
          width: 100%;
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
  droneAnimationTrigger = 0;

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
      cell.style.fontWeight = 'bold';

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
      yLabel.style.fontWeight = 'bold';
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

          // Trigger animation
          this.droneAnimationTrigger++;

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

        // Trigger animation
        this.droneAnimationTrigger++;

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

        // Trigger animation
        this.droneAnimationTrigger++;

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
