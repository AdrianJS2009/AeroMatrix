import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
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
  ],
  providers: [MessageService],
  template: `
    <div class="flex justify-between items-center mb-3">
      <h2>Matrices</h2>
      <button
        pButton
        icon="pi pi-plus"
        label="Nueva"
        class="p-button-sm"
        (click)="openForm()"
      />
    </div>

    <p-table
      [value]="matrices"
      [paginator]="true"
      [rows]="10"
      [responsiveLayout]="'scroll'"
    >
      <ng-template pTemplate="header">
        <tr>
          <th>ID</th>
          <th>Dimensiones</th>
          <th>Drones</th>
          <th>Acciones</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-matrix>
        <tr>
          <td>{{ matrix.id }}</td>
          <td>{{ matrix.maxX }} x {{ matrix.maxY }}</td>
          <td>
            <ul>
              <li *ngFor="let drone of matrix.drones">
                {{ drone.name }} ({{ drone.model }}) → ({{ drone.x }},
                {{ drone.y }})
              </li>
            </ul>
          </td>
          <td>
            <button
              pButton
              icon="pi pi-pencil"
              class="p-button-rounded p-button-text p-button-sm me-1"
              (click)="openForm(matrix)"
            />
            <button
              pButton
              icon="pi pi-trash"
              class="p-button-rounded p-button-text p-button-sm p-button-danger"
              (click)="deleteMatrix(matrix.id)"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>

    <app-matrix-form
      [visible]="formVisible"
      [matrixToEdit]="selectedMatrix"
      (saved)="loadMatrices()"
      (close)="closeForm()"
    />
  `,
})
export class MatrixListComponent implements OnInit {
  matrices: Matrix[] = [];
  formVisible = false;
  selectedMatrix?: Matrix;

  constructor(
    private matrixService: MatrixService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadMatrices();
  }

  loadMatrices() {
    this.matrixService.getAll().subscribe({
      next: (data) => (this.matrices = data),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las matrices',
        });
      },
    });
  }

  deleteMatrix(id: number) {
    this.matrixService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Matriz eliminada',
          detail: `ID ${id}`,
        });
        this.loadMatrices();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al eliminar',
          detail: err.error?.message || 'Error inesperado',
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
