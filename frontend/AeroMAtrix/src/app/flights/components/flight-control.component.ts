import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
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
    <p-card>
      <h2 class="mb-4">Control de Vuelos</h2>

      <div *ngIf="loading" class="flex justify-content-center my-5">
        <p-progressSpinner strokeWidth="4"></p-progressSpinner>
      </div>

      <p-tabView *ngIf="!loading">
        <!-- EJECUTAR COMANDOS A UN DRON -->
        <p-tabPanel header="Un solo dron">
          <div class="p-fluid">
            <div class="field">
              <label class="font-bold">Dron</label>
              <p-dropdown
                [options]="drones"
                [(ngModel)]="selectedDrone"
                optionLabel="name"
                placeholder="Selecciona un dron"
                [filter]="true"
                filterBy="name"
                [showClear]="true"
                styleClass="w-full"
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
                      [label]="selectedDrone.orientation"
                      [removable]="false"
                      styleClass="p-chip-sm"
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
                      [label]="drone.orientation"
                      [removable]="false"
                      styleClass="p-chip-sm"
                    ></p-chip>
                  </div>
                </ng-template>
              </p-dropdown>
            </div>

            <div class="field mt-3">
              <label class="font-bold">Comandos</label>
              <div class="p-inputgroup">
                <input
                  type="text"
                  pInputText
                  [(ngModel)]="commandsText"
                  placeholder="Ej: AIAAD"
                  [ngClass]="{ 'ng-invalid': commandsTextInvalid }"
                />
                <button
                  pButton
                  type="button"
                  icon="pi pi-question-circle"
                  pTooltip="A = Avanzar, I = Izquierda, D = Derecha"
                  tooltipPosition="left"
                  class="p-button-info"
                ></button>
              </div>
              <small *ngIf="commandsTextInvalid" class="p-error">
                Comandos inválidos. Use solo A (Avanzar), I (Izquierda), D
                (Derecha)
              </small>
            </div>

            <button
              pButton
              label="Ejecutar"
              icon="pi pi-play"
              class="mt-3"
              (click)="executeSingle()"
              [disabled]="!selectedDrone || !commandsText || executingSingle"
              [loading]="executingSingle"
            ></button>
          </div>
        </p-tabPanel>

        <!-- EJECUTAR MISMA SECUENCIA A VARIOS DRONES -->
        <p-tabPanel header="Varios drones - mismos comandos">
          <div class="p-fluid">
            <div class="field">
              <label class="font-bold">Drones</label>
              <p-multiSelect
                [options]="drones"
                [(ngModel)]="multiSelectedDrones"
                optionLabel="name"
                placeholder="Selecciona drones"
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
              <label class="font-bold">Comandos</label>
              <div class="p-inputgroup">
                <input
                  type="text"
                  pInputText
                  [(ngModel)]="commandsGroupText"
                  placeholder="Ej: DDAIA"
                  [ngClass]="{ 'ng-invalid': commandsGroupTextInvalid }"
                />
                <button
                  pButton
                  type="button"
                  icon="pi pi-question-circle"
                  pTooltip="A = Avanzar, I = Izquierda, D = Derecha"
                  tooltipPosition="left"
                  class="p-button-info"
                ></button>
              </div>
              <small *ngIf="commandsGroupTextInvalid" class="p-error">
                Comandos inválidos. Use solo A (Avanzar), I (Izquierda), D
                (Derecha)
              </small>
            </div>

            <button
              pButton
              label="Ejecutar en grupo"
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

        <!-- EJECUTAR COMANDOS DISTINTOS A DRONES -->
        <p-tabPanel header="Secuencias distintas por dron">
          <div
            *ngFor="let item of batchCommands; let i = index"
            class="mb-4 p-fluid"
          >
            <div class="flex align-items-start gap-2">
              <div class="flex-grow-1">
                <div class="field">
                  <label class="font-bold">Dron</label>
                  <p-dropdown
                    [options]="drones"
                    [(ngModel)]="item.droneId"
                    optionLabel="name"
                    placeholder="Selecciona dron"
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
                  <label class="font-bold">Comandos</label>
                  <div class="p-inputgroup">
                    <input
                      type="text"
                      pInputText
                      [(ngModel)]="item.commands"
                      placeholder="Ej: AAIID"
                      [ngClass]="{
                        'ng-invalid': isBatchCommandInvalid(item.commands)
                      }"
                    />
                    <button
                      pButton
                      type="button"
                      icon="pi pi-question-circle"
                      pTooltip="A = Avanzar, I = Izquierda, D = Derecha"
                      tooltipPosition="left"
                      class="p-button-info"
                    ></button>
                  </div>
                  <small
                    *ngIf="isBatchCommandInvalid(item.commands)"
                    class="p-error"
                  >
                    Comandos inválidos. Use solo A (Avanzar), I (Izquierda), D
                    (Derecha)
                  </small>
                </div>
              </div>

              <button
                pButton
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger p-button-outlined mt-4"
                (click)="batchCommands.splice(i, 1)"
              ></button>
            </div>

            <p-divider *ngIf="i < batchCommands.length - 1"></p-divider>
          </div>

          <div class="flex gap-2 mt-4">
            <button
              pButton
              label="Agregar fila"
              icon="pi pi-plus"
              class="p-button-outlined"
              (click)="addBatchCommand()"
            ></button>
            <button
              pButton
              label="Ejecutar lote"
              icon="pi pi-play"
              (click)="executeBatch()"
              [disabled]="!isValidBatch() || executingBatch"
              [loading]="executingBatch"
            ></button>
          </div>
        </p-tabPanel>
      </p-tabView>
    </p-card>

    <p-toast></p-toast>
  `,
})
export class FlightControlComponent implements OnInit {
  drones: Drone[] = [];
  loading = true;

  // Modo 1: individual
  selectedDrone?: Drone;
  commandsText = '';
  commandsTextInvalid = false;
  executingSingle = false;

  // Modo 2: grupo
  multiSelectedDrones: Drone[] = [];
  commandsGroupText = '';
  commandsGroupTextInvalid = false;
  executingGroup = false;

  // Modo 3: lote distinto
  batchCommands: { droneId: number | null; commands: string }[] = [];
  executingBatch = false;

  constructor(
    private droneService: DroneService,
    private flightService: FlightService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDrones();
    this.addBatchCommand(); // Iniciar con una fila
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
          detail: err.message || 'No se pudieron cargar los drones',
          life: 5000,
        });
        this.loading = false;
      },
    });
  }

  validateCommands(commands: string): boolean {
    return /^[AID]+$/i.test(commands);
  }

  executeSingle() {
    if (!this.validateCommands(this.commandsText)) {
      this.commandsTextInvalid = true;
      return;
    }

    this.commandsTextInvalid = false;
    this.executingSingle = true;
    const commands = this.commandsText.toUpperCase().split('');

    this.flightService
      .sendCommands(this.selectedDrone!.id, commands)
      .subscribe({
        next: (drone) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Comandos ejecutados',
            detail: `Nueva posición: (${drone.x}, ${drone.y}) - Orientación: ${drone.orientation}`,
            life: 3000,
          });
          this.executingSingle = false;
          this.loadDrones(); // Actualizar lista de drones
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message || 'Falló el vuelo',
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
    const commands = this.commandsGroupText.toUpperCase().split('');

    this.flightService.sendCommandsToMany(droneIds, commands).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Comandos enviados al grupo',
          detail: `Drones: ${droneIds.join(', ')}`,
          life: 3000,
        });
        this.executingGroup = false;
        this.loadDrones(); // Actualizar lista de drones
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error en grupo',
          detail: err.message || 'Falló el vuelo',
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
        summary: 'Validación',
        detail: 'Por favor complete correctamente al menos una fila',
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
        commands: b.commands.toUpperCase().split(''),
      }));

    this.flightService.sendBatchCommands(batch).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Comandos enviados por lote',
          detail: `Total drones: ${batch.length}`,
          life: 3000,
        });
        this.executingBatch = false;
        this.batchCommands = [{ droneId: null, commands: '' }];
        this.loadDrones(); // Actualizar lista de drones
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error en lote',
          detail: err.message || 'Falló el lote',
          life: 5000,
        });
        this.executingBatch = false;
      },
    });
  }
}
