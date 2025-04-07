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
    AvatarModule,
    StepsModule,
    TagModule,
    ScrollPanelModule,
    InputSwitchModule,
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
  template: `
    <div class="flight-control-container" @fadeIn>
      <div class="page-header">
        <div class="header-content">
          <div>
            <h1>Flight Control Center</h1>
            <p>Control and monitor drone movements in real-time</p>
          </div>
          <div class="header-actions">
            <p-inputSwitch
              [(ngModel)]="darkMode"
              (onChange)="toggleDarkMode()"
              class="mr-2"
            ></p-inputSwitch>
            <label class="dark-mode-label">Dark Mode</label>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="loading-container">
        <p-progressSpinner
          strokeWidth="4"
          aria-label="Loading drones"
        ></p-progressSpinner>
        <span>Loading flight control system...</span>
      </div>

      <div
        *ngIf="!loading"
        class="flight-control-content"
        [ngClass]="{ 'dark-theme': darkMode }"
      >
        <div class="grid">
          <!-- Matrix Visualization -->
          <div class="col-12 lg:col-6 xl:col-7">
            <div class="matrix-container">
              <app-drone-matrix
                [matrix]="selectedMatrix"
                [drones]="selectedMatrix?.drones || []"
                [selectedDroneId]="selectedDrone?.id"
                (droneSelected)="onMatrixDroneSelect($event)"
              ></app-drone-matrix>
            </div>
          </div>

          <!-- Flight Controls -->
          <div class="col-12 lg:col-6 xl:col-5">
            <p-card styleClass="flight-controls-card">
              <p-tabView styleClass="flight-tabs">
                <!-- SINGLE DRONE COMMANDS -->
                <p-tabPanel header="Single Drone" leftIcon="pi pi-send">
                  <div class="p-fluid">
                    <div class="field">
                      <label class="font-bold">Select Drone</label>
                      <p-dropdown
                        [options]="drones"
                        [(ngModel)]="selectedDrone"
                        optionLabel="name"
                        placeholder="Select a drone"
                        [filter]="true"
                        filterBy="name"
                        [showClear]="true"
                        styleClass="w-full"
                        (onChange)="onDroneSelect()"
                      >
                        <ng-template pTemplate="selectedItem">
                          <div
                            *ngIf="selectedDrone"
                            class="drone-selection-item"
                          >
                            <p-avatar
                              [label]="selectedDrone.name.charAt(0)"
                              styleClass="mr-2"
                              [style]="{
                                'background-color': getDroneColor(
                                  selectedDrone.id
                                )
                              }"
                            ></p-avatar>
                            <div class="drone-details">
                              <span class="drone-name">{{
                                selectedDrone.name
                              }}</span>
                              <div class="drone-meta">
                                <p-tag
                                  [value]="
                                    '(' +
                                    selectedDrone.x +
                                    ',' +
                                    selectedDrone.y +
                                    ')'
                                  "
                                  [rounded]="true"
                                  severity="info"
                                  styleClass="mr-2"
                                ></p-tag>
                                <p-tag
                                  [value]="
                                    getOrientationLabel(
                                      selectedDrone.orientation
                                    )
                                  "
                                  [rounded]="true"
                                  [severity]="
                                    getOrientationSeverity(
                                      selectedDrone.orientation
                                    )
                                  "
                                ></p-tag>
                              </div>
                            </div>
                          </div>
                        </ng-template>
                        <ng-template let-drone pTemplate="item">
                          <div class="drone-selection-item">
                            <p-avatar
                              [label]="drone.name.charAt(0)"
                              styleClass="mr-2"
                              [style]="{
                                'background-color': getDroneColor(drone.id)
                              }"
                            ></p-avatar>
                            <div class="drone-details">
                              <span class="drone-name">{{ drone.name }}</span>
                              <div class="drone-meta">
                                <p-tag
                                  [value]="'(' + drone.x + ',' + drone.y + ')'"
                                  [rounded]="true"
                                  severity="info"
                                  styleClass="mr-2"
                                ></p-tag>
                                <p-tag
                                  [value]="
                                    getOrientationLabel(drone.orientation)
                                  "
                                  [rounded]="true"
                                  [severity]="
                                    getOrientationSeverity(drone.orientation)
                                  "
                                ></p-tag>
                              </div>
                            </div>
                          </div>
                        </ng-template>
                      </p-dropdown>
                    </div>

                    <div class="field mt-3">
                      <label class="font-bold">Flight Commands</label>
                      <div class="p-inputgroup">
                        <input
                          type="text"
                          pInputText
                          [(ngModel)]="commandsText"
                          placeholder="Enter commands (e.g., AALRRA)"
                          [ngClass]="{ 'ng-invalid': commandsTextInvalid }"
                          aria-describedby="commands-help"
                        />
                        <button
                          pButton
                          pRipple
                          type="button"
                          icon="pi pi-trash"
                          class="p-button-danger"
                          pTooltip="Clear Commands"
                          tooltipPosition="left"
                          (click)="clearCommands()"
                        ></button>
                      </div>
                      <small
                        id="commands-help"
                        *ngIf="commandsTextInvalid"
                        class="p-error"
                      >
                        Invalid commands. Use only A (Advance), L (Left), R
                        (Right)
                      </small>
                      <small *ngIf="!commandsTextInvalid" class="command-help">
                        A = Advance, L = Turn Left, R = Turn Right
                      </small>
                    </div>

                    <div class="command-legend">
                      <div class="legend-item">
                        <div class="legend-color advance"></div>
                        <span>A - Advance</span>
                      </div>
                      <div class="legend-item">
                        <div class="legend-color left"></div>
                        <span>L - Turn Left</span>
                      </div>
                      <div class="legend-item">
                        <div class="legend-color right"></div>
                        <span>R - Turn Right</span>
                      </div>
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
                    </div>

                    <div class="command-preview" *ngIf="commandsText">
                      <label>Command Preview:</label>
                      <div class="command-sequence">
                        <div
                          *ngFor="
                            let cmd of commandsText.split('');
                            let i = index
                          "
                          class="command-step"
                          [ngClass]="{
                            'advance-step': cmd.toUpperCase() === 'A',
                            'left-step': cmd.toUpperCase() === 'L',
                            'right-step': cmd.toUpperCase() === 'R'
                          }"
                        >
                          {{ cmd.toUpperCase() }}
                        </div>
                      </div>
                    </div>

                    <button
                      pButton
                      pRipple
                      label="Execute Flight"
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
                <p-tabPanel header="Group Flight" leftIcon="pi pi-users">
                  <div class="p-fluid">
                    <div class="field">
                      <label class="font-bold">Select Multiple Drones</label>
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
                          <div class="drone-selection-item">
                            <p-avatar
                              [label]="drone.name.charAt(0)"
                              styleClass="mr-2"
                              [style]="{
                                'background-color': getDroneColor(drone.id)
                              }"
                            ></p-avatar>
                            <div class="drone-details">
                              <span class="drone-name">{{ drone.name }}</span>
                              <div class="drone-meta">
                                <p-tag
                                  [value]="'(' + drone.x + ',' + drone.y + ')'"
                                  [rounded]="true"
                                  severity="info"
                                ></p-tag>
                              </div>
                            </div>
                          </div>
                        </ng-template>
                      </p-multiSelect>
                    </div>

                    <div
                      class="selected-drones-preview"
                      *ngIf="multiSelectedDrones.length > 0"
                    >
                      <p-scrollPanel
                        [style]="{ width: '100%', height: '100px' }"
                        styleClass="custom-scrollbar"
                      >
                        <div class="selected-drones-grid">
                          <div
                            *ngFor="let drone of multiSelectedDrones"
                            class="selected-drone-item"
                          >
                            <p-avatar
                              [label]="drone.name.charAt(0)"
                              [style]="{
                                'background-color': getDroneColor(drone.id)
                              }"
                              size="normal"
                            ></p-avatar>
                            <span>{{ drone.name }}</span>
                          </div>
                        </div>
                      </p-scrollPanel>
                    </div>

                    <div class="field mt-3">
                      <label class="font-bold"
                        >Flight Commands for All Selected Drones</label
                      >
                      <div class="p-inputgroup">
                        <input
                          type="text"
                          pInputText
                          [(ngModel)]="commandsGroupText"
                          placeholder="Enter commands (e.g., RRALA)"
                          [ngClass]="{ 'ng-invalid': commandsGroupTextInvalid }"
                          aria-describedby="group-commands-help"
                        />
                        <button
                          pButton
                          pRipple
                          type="button"
                          icon="pi pi-trash"
                          class="p-button-danger"
                          pTooltip="Clear Commands"
                          tooltipPosition="left"
                          (click)="clearGroupCommands()"
                        ></button>
                      </div>
                      <small
                        id="group-commands-help"
                        *ngIf="commandsGroupTextInvalid"
                        class="p-error"
                      >
                        Invalid commands. Use only A (Advance), L (Left), R
                        (Right)
                      </small>
                      <small
                        *ngIf="!commandsGroupTextInvalid"
                        class="command-help"
                      >
                        A = Advance, L = Turn Left, R = Turn Right
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
                    </div>

                    <div class="command-preview" *ngIf="commandsGroupText">
                      <label>Command Preview:</label>
                      <div class="command-sequence">
                        <div
                          *ngFor="
                            let cmd of commandsGroupText.split('');
                            let i = index
                          "
                          class="command-step"
                          [ngClass]="{
                            'advance-step': cmd.toUpperCase() === 'A',
                            'left-step': cmd.toUpperCase() === 'L',
                            'right-step': cmd.toUpperCase() === 'R'
                          }"
                        >
                          {{ cmd.toUpperCase() }}
                        </div>
                      </div>
                    </div>

                    <button
                      pButton
                      pRipple
                      label="Execute Group Flight"
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
                <p-tabPanel header="Batch Flights" leftIcon="pi pi-list">
                  <div class="batch-flights-container">
                    <p-scrollPanel
                      [style]="{ width: '100%', height: '400px' }"
                      styleClass="custom-scrollbar"
                    >
                      <div
                        *ngFor="let item of batchCommands; let i = index"
                        class="batch-command-row"
                        @slideIn
                      >
                        <div class="batch-header">
                          <span class="batch-number">Flight #{{ i + 1 }}</span>
                          <button
                            pButton
                            pRipple
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-danger p-button-outlined p-button-sm"
                            (click)="batchCommands.splice(i, 1)"
                            pTooltip="Remove"
                          ></button>
                        </div>

                        <div class="field">
                          <label>Drone</label>
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
                              <div class="drone-selection-item">
                                <p-avatar
                                  [label]="drone.name.charAt(0)"
                                  styleClass="mr-2"
                                  [style]="{
                                    'background-color': getDroneColor(drone.id)
                                  }"
                                  size="normal"
                                ></p-avatar>
                                <span>{{ drone.name }}</span>
                              </div>
                            </ng-template>
                          </p-dropdown>
                        </div>

                        <div class="field mt-2">
                          <label>Commands</label>
                          <div class="p-inputgroup">
                            <input
                              type="text"
                              pInputText
                              [(ngModel)]="item.commands"
                              placeholder="Ex: AALRR"
                              [ngClass]="{
                                'ng-invalid': isBatchCommandInvalid(
                                  item.commands
                                )
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

                        <div class="command-preview" *ngIf="item.commands">
                          <div class="command-sequence small">
                            <div
                              *ngFor="
                                let cmd of item.commands.split('');
                                let j = index
                              "
                              class="command-step"
                              [ngClass]="{
                                'advance-step': cmd.toUpperCase() === 'A',
                                'left-step': cmd.toUpperCase() === 'L',
                                'right-step': cmd.toUpperCase() === 'R'
                              }"
                            >
                              {{ cmd.toUpperCase() }}
                            </div>
                          </div>
                        </div>

                        <p-divider
                          *ngIf="i < batchCommands.length - 1"
                        ></p-divider>
                      </div>
                    </p-scrollPanel>

                    <div class="batch-actions">
                      <button
                        pButton
                        pRipple
                        label="Add Flight"
                        icon="pi pi-plus"
                        class="p-button-outlined"
                        (click)="addBatchCommand()"
                      ></button>
                      <button
                        pButton
                        pRipple
                        label="Execute All Flights"
                        icon="pi pi-play"
                        (click)="executeBatch()"
                        [disabled]="!isValidBatch() || executingBatch"
                        [loading]="executingBatch"
                      ></button>
                    </div>
                  </div>
                </p-tabPanel>
              </p-tabView>
            </p-card>
          </div>
        </div>

        <!-- Flight History Section -->
        <div
          class="flight-history-section"
          *ngIf="flightHistory.length > 0"
          @fadeIn
        >
          <h2>Recent Flight Activity</h2>
          <div class="flight-history-container">
            <div
              class="flight-history-item"
              *ngFor="let flight of flightHistory"
              @slideInRight
            >
              <div class="flight-time">{{ flight.time }}</div>
              <div class="flight-content">
                <div class="flight-header">
                  <p-avatar
                    [label]="flight.drone.charAt(0)"
                    styleClass="mr-2"
                    [style]="{
                      'background-color': getRandomColor(flight.drone)
                    }"
                    size="normal"
                  ></p-avatar>
                  <span class="flight-drone">{{ flight.drone }}</span>
                  <p-tag
                    [value]="flight.status"
                    [severity]="getStatusSeverity(flight.status)"
                    styleClass="ml-2"
                  ></p-tag>
                </div>
                <div class="flight-details">
                  <div class="flight-commands">
                    <span class="commands-label">Commands:</span>
                    <div class="command-sequence small">
                      <div
                        *ngFor="
                          let cmd of flight.commands.split('');
                          let i = index
                        "
                        class="command-step"
                        [ngClass]="{
                          'advance-step': cmd.toUpperCase() === 'A',
                          'left-step': cmd.toUpperCase() === 'L',
                          'right-step': cmd.toUpperCase() === 'R'
                        }"
                      >
                        {{ cmd.toUpperCase() }}
                      </div>
                    </div>
                  </div>
                  <div class="flight-positions">
                    <span class="position-label">From:</span>
                    <p-tag
                      [value]="flight.startPosition"
                      severity="info"
                      styleClass="mr-3"
                    ></p-tag>
                    <span class="position-label">To:</span>
                    <p-tag
                      [value]="flight.endPosition"
                      severity="success"
                    ></p-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        margin-bottom: 1.5rem;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .header-actions {
        display: flex;
        align-items: center;
      }

      .dark-mode-label {
        font-size: 0.875rem;
        color: var(--text-color-secondary);
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

      .flight-control-content {
        transition: all 0.3s ease;
      }

      .flight-control-content.dark-theme {
        background-color: var(--surface-ground);
        border-radius: 8px;
        padding: 1rem;
      }

      .matrix-container {
        height: 100%;
        min-height: 500px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      /* Flight Controls Styling */
      :host ::ng-deep .flight-controls-card {
        height: 100%;
      }

      :host ::ng-deep .flight-controls-card .p-card-body {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      :host ::ng-deep .flight-controls-card .p-card-content {
        flex: 1;
        padding: 0;
      }

      :host ::ng-deep .flight-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      :host ::ng-deep .flight-tabs .p-tabview-panels {
        flex: 1;
        padding: 1.5rem;
      }

      :host ::ng-deep .flight-tabs .p-tabview-nav {
        background-color: var(--surface-ground);
      }

      :host ::ng-deep .flight-tabs .p-tabview-nav li .p-tabview-nav-link {
        padding: 1rem 1.25rem;
      }

      .drone-selection-item {
        display: flex;
        align-items: center;
      }

      .drone-details {
        display: flex;
        flex-direction: column;
      }

      .drone-name {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .drone-meta {
        display: flex;
        align-items: center;
      }

      .command-help {
        color: var(--text-color-secondary);
        font-size: 0.875rem;
      }

      .command-legend {
        display: flex;
        justify-content: space-between;
        margin: 1rem 0;
        padding: 0.5rem;
        background-color: var(--surface-ground);
        border-radius: 8px;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
      }

      .legend-color {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
      }

      .legend-color.advance {
        background: linear-gradient(135deg, var(--green-500), var(--green-700));
      }

      .legend-color.left {
        background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
      }

      .legend-color.right {
        background: linear-gradient(
          135deg,
          var(--orange-500),
          var(--orange-700)
        );
      }

      .command-buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 1.5rem 0;
      }

      .command-button {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
        width: 60px;
        height: 60px;
        font-size: 1.25rem;
        font-weight: bold;
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

      .command-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      }

      .command-preview {
        background-color: var(--surface-ground);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1.5rem;
      }

      .command-preview label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        font-size: 0.875rem;
        color: var(--text-color-secondary);
      }

      .command-sequence {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .command-sequence.small {
        gap: 0.25rem;
      }

      .command-step {
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        font-weight: bold;
        color: white;
      }

      .command-sequence.small .command-step {
        width: 1.5rem;
        height: 1.5rem;
        font-size: 0.75rem;
      }

      .advance-step {
        background-color: var(--green-600);
      }

      .left-step {
        background-color: var(--blue-600);
      }

      .right-step {
        background-color: var(--orange-600);
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

      .selected-drones-preview {
        background-color: var(--surface-ground);
        border-radius: 8px;
        margin: 1rem 0;
      }

      .selected-drones-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 0.5rem;
        padding: 0.5rem;
      }

      .selected-drone-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background-color: var(--surface-card);
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
      }

      /* Batch Flights Styling */
      .batch-flights-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .batch-command-row {
        background-color: var(--surface-ground);
        border-radius: 8px;
        padding: 1.25rem;
        margin-bottom: 1rem;
      }

      .batch-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .batch-number {
        font-weight: 600;
        color: var(--primary-color);
      }

      .batch-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
      }

      /* Flight History Section */
      .flight-history-section {
        margin-top: 2rem;
      }

      .flight-history-section h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: var(--text-color);
      }

      .flight-history-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
      }

      .flight-history-item {
        background-color: var(--surface-card);
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        position: relative;
        overflow: hidden;
      }

      .flight-time {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        font-size: 0.75rem;
        color: var(--text-color-secondary);
      }

      .flight-header {
        display: flex;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .flight-drone {
        font-weight: 600;
      }

      .flight-details {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .flight-commands,
      .flight-positions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .commands-label,
      .position-label {
        font-size: 0.75rem;
        color: var(--text-color-secondary);
      }

      /* Custom Scrollbar */
      :host ::ng-deep .custom-scrollbar .p-scrollpanel-wrapper {
        border-radius: 8px;
      }

      :host ::ng-deep .custom-scrollbar .p-scrollpanel-bar {
        background-color: var(--primary-300);
        opacity: 0.6;
      }

      :host ::ng-deep .custom-scrollbar .p-scrollpanel-bar:hover {
        background-color: var(--primary-400);
        opacity: 0.8;
      }

      /* Responsive Adjustments */
      @media screen and (max-width: 768px) {
        .header-content {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        .command-legend {
          flex-direction: column;
          gap: 0.5rem;
        }

        .batch-actions {
          flex-direction: column;
        }

        .batch-actions button {
          width: 100%;
        }

        .flight-history-container {
          grid-template-columns: 1fr;
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
  darkMode = false;

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

  onDroneSelect() {
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

  private refreshDronesAndMatrix() {
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
            this.selectedMatrix = { ...updatedMatrix }; // ⚠️ Cambiar referencia
          }
        }
      },
      error: (err) => {
        console.error('Error actualizando drones:', err);
      },
    });
  }

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

  addBatchCommand() {
    this.batchCommands.push({ droneId: null, commands: '' });
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

  getOrientationSeverity(
    orientation: string
  ): 'success' | 'info' | 'warning' | 'danger' {
    const map = {
      N: 'success',
      S: 'warning',
      E: 'info',
      W: 'info',
    } as const;

    return map[orientation as keyof typeof map] || 'info';
  }

  getDroneColor(id: number): string {
    // Generate a consistent color based on drone ID
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

  getRandomColor(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      '#3B82F6', // primary
      '#10B981', // green
      '#F59E0B', // yellow
      '#EF4444', // red
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#06B6D4', // cyan
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
  ) {
    // Add new flight to the beginning
    this.flightHistory.unshift({
      drone,
      commands,
      startPosition,
      endPosition,
      status,
      time: this.getRelativeTime(new Date()),
    });

    // Limit history to 10 items
    if (this.flightHistory.length > 10) {
      this.flightHistory = this.flightHistory.slice(0, 10);
    }
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
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

  toggleDarkMode() {
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
