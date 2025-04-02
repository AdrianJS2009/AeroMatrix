import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
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
import { DroneMatrixComponent } from '../../drones/components/drone-matrix.component';
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
    DroneMatrixComponent,
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
        <div class="col-12 lg:col-6">
          <app-drone-matrix
            [matrix]="selectedMatrix"
            [drones]="selectedMatrix?.drones || []"
            [selectedDroneId]="selectedDrone?.id"
            (droneSelected)="onMatrixDroneSelect($event)"
          ></app-drone-matrix>
        </div>

        <!-- Flight Controls -->
        <div class="col-12 lg:col-6">
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
                    class="p-button-rounded p-button-lg command-button advance"
                    pTooltip="Advance"
                    tooltipPosition="top"
                    (click)="addCommand('A')"
                  ></button>
                  <button
                    pButton
                    pRipple
                    label="L"
                    class="p-button-rounded p-button-lg p-button-secondary command-button left"
                    pTooltip="Turn Left"
                    tooltipPosition="top"
                    (click)="addCommand('L')"
                  ></button>
                  <button
                    pButton
                    pRipple
                    label="R"
                    class="p-button-rounded p-button-lg p-button-secondary command-button right"
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
                    class="p-button-rounded p-button-lg command-button advance"
                    pTooltip="Advance"
                    tooltipPosition="top"
                    (click)="addGroupCommand('A')"
                  ></button>
                  <button
                    pButton
                    pRipple
                    label="L"
                    class="p-button-rounded p-button-lg p-button-secondary command-button left"
                    pTooltip="Turn Left"
                    tooltipPosition="top"
                    (click)="addGroupCommand('L')"
                  ></button>
                  <button
                    pButton
                    pRipple
                    label="R"
                    class="p-button-rounded p-button-lg p-button-secondary command-button right"
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

      .command-button {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .command-button::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5px;
        height: 5px;
        background: rgba(255, 255, 255, 0.5);
        opacity: 0;
        border-radius: 100%;
        transform: scale(1, 1) translate(-50%);
        transform-origin: 50% 50%;
      }

      .command-button:active::after {
        animation: ripple 0.6s ease-out;
      }

      .command-button.advance {
        background: linear-gradient(135deg, var(--green-500), var(--green-700));
        border-color: var(--green-700);
      }

      .command-button.left {
        background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
        border-color: var(--blue-700);
      }

      .command-button.right {
        background: linear-gradient(
          135deg,
          var(--orange-500),
          var(--orange-700)
        );
        border-color: var(--orange-700);
      }

      @keyframes ripple {
        0% {
          transform: scale(0, 0);
          opacity: 0.5;
        }
        20% {
          transform: scale(25, 25);
          opacity: 0.5;
        }
        100% {
          opacity: 0;
          transform: scale(40, 40);
        }
      }

      .execute-button {
        margin-top: 1rem;
        padding: 1rem;
        font-weight: 600;
        background: linear-gradient(
          135deg,
          var(--primary-500),
          var(--primary-700)
        );
        border-color: var(--primary-700);
        transition: all 0.3s ease;
      }

      .execute-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

      /* Responsive Adjustments */
      @media screen and (max-width: 768px) {
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

  onMatrixDroneSelect(drone: Drone) {
    this.selectedDrone = drone;
  }

  loadMatrixForDrone(matrixId: number) {
    const matrix = this.matrices.find((m) => m.id === matrixId);
    if (matrix) {
      this.selectedMatrix = matrix;
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
