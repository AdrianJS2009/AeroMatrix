import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Matrix } from '../models/matrix.model';
import { MatrixService } from '../services/matrix.service';
import { MatrixFormComponent } from './matrix-form.component';

@Component({
  selector: 'app-matrix-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    MatrixFormComponent,
    ConfirmDialogModule,
    CardModule,
    TagModule,
    SkeletonModule,
    ChipModule,
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-card>
      <div class="flex justify-content-between align-items-center mb-3">
        <h2 class="m-0">Matrices</h2>
        <button
          pButton
          icon="pi pi-plus"
          label="Nueva Matriz"
          class="p-button-sm"
          (click)="openForm()"
        ></button>
      </div>

      <p-table
        [value]="matrices"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[5, 10, 25]"
        [loading]="loading"
        styleClass="p-datatable-sm p-datatable-gridlines"
        [tableStyle]="{ 'min-width': '50rem' }"
        responsiveLayout="scroll"
      >
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="id" style="width: 5rem">
              ID <p-sortIcon field="id"></p-sortIcon>
            </th>
            <th>Dimensiones</th>
            <th>Drones</th>
            <th style="width: 8rem">Acciones</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-matrix>
          <tr>
            <td>{{ matrix.id }}</td>
            <td>
              <p-tag
                [value]="matrix.maxX + ' x ' + matrix.maxY"
                [rounded]="true"
                severity="info"
              ></p-tag>
            </td>
            <td>
              <div *ngIf="matrix.drones.length === 0" class="text-500">
                No hay drones asignados
              </div>
              <div
                *ngIf="matrix.drones.length > 0"
                class="flex flex-wrap gap-2"
              >
                <p-chip
                  *ngFor="let drone of matrix.drones.slice(0, 3)"
                  [label]="drone.name + ' (' + drone.x + ',' + drone.y + ')'"
                ></p-chip>
                <p-chip
                  *ngIf="matrix.drones.length > 3"
                  [label]="'+ ' + (matrix.drones.length - 3) + ' más'"
                  styleClass="bg-primary"
                ></p-chip>
              </div>
            </td>
            <td>
              <div class="flex gap-2 justify-content-center">
                <button
                  pButton
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text p-button-sm"
                  (click)="openForm(matrix)"
                  pTooltip="Editar"
                ></button>
                <button
                  pButton
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-sm p-button-danger"
                  (click)="confirmDelete(matrix)"
                  pTooltip="Eliminar"
                  [disabled]="matrix.drones.length > 0"
                ></button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="4" class="text-center p-4">
              <div *ngIf="loading" class="flex flex-column align-items-center">
                <p-skeleton
                  height="2rem"
                  styleClass="mb-2"
                  width="20rem"
                ></p-skeleton>
                <p-skeleton
                  height="2rem"
                  styleClass="mb-2"
                  width="15rem"
                ></p-skeleton>
                <p-skeleton height="2rem" width="10rem"></p-skeleton>
              </div>
              <div *ngIf="!loading">
                No se encontraron matrices. Crea una nueva para comenzar.
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>

    <app-matrix-form
      [visible]="formVisible"
      [matrixToEdit]="selectedMatrix"
      (saved)="loadMatrices()"
      (close)="closeForm()"
    />

    <p-confirmDialog
      header="Confirmar Eliminación"
      icon="pi pi-exclamation-triangle"
      acceptLabel="Sí, eliminar"
      rejectLabel="Cancelar"
      acceptButtonStyleClass="p-button-danger"
    ></p-confirmDialog>

    <p-toast></p-toast>
  `,
})
export class MatrixListComponent implements OnInit {
  matrices: Matrix[] = [];
  formVisible = false;
  selectedMatrix?: Matrix;
  loading = true;

  constructor(
    private matrixService: MatrixService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadMatrices();
  }

  loadMatrices() {
    this.loading = true;
    this.matrixService.getAll().subscribe({
      next: (data) => {
        this.matrices = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'No se pudieron cargar las matrices',
          life: 5000,
        });
        this.loading = false;
      },
    });
  }

  confirmDelete(matrix: Matrix) {
    if (matrix.drones.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No se puede eliminar',
        detail:
          'Esta matriz tiene drones asignados. Elimine los drones primero.',
        life: 5000,
      });
      return;
    }

    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar la matriz ${matrix.id}?`,
      accept: () => this.deleteMatrix(matrix.id),
    });
  }

  deleteMatrix(id: number) {
    this.matrixService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Matriz eliminada',
          detail: `Matriz ID ${id} eliminada correctamente`,
          life: 3000,
        });
        this.loadMatrices();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al eliminar',
          detail: err.message || 'Error inesperado',
          life: 5000,
        });
      },
    });
  }

  openForm(matrix?: Matrix) {
    this.selectedMatrix = matrix;
    this.formVisible = true;
  }

  closeForm() {
    this.selectedMatrix = undefined;
    this.formVisible = false;
  }
}
