import { Component, type OnInit } from '@angular/core';
import type { ConfirmationService, MessageService } from 'primeng/api';
import type {
  CreateMatrixRequest,
  MatrixModel,
} from '../../../models/matrix.model';
import type { MatrixService } from '../../../services/matrix.service';

@Component({
  selector: 'app-matrix-list',
  templateUrl: './matrix-list.component.html',
  styleUrls: ['./matrix-list.component.css'],
})
export class MatrixListComponent implements OnInit {
  matrices: MatrixModel[] = [];
  loading = true;
  displayCreateDialog = false;
  newMatrix: CreateMatrixRequest = { maxX: 10, maxY: 10 };

  constructor(
    private matrixService: MatrixService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadMatrices();
  }

  loadMatrices(): void {
    this.loading = true;
    this.matrixService.getMatrices().subscribe({
      next: (data) => {
        this.matrices = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load matrices',
        });
        this.loading = false;
      },
    });
  }

  openCreateDialog(): void {
    this.newMatrix = { maxX: 10, maxY: 10 };
    this.displayCreateDialog = true;
  }

  createMatrix(): void {
    this.matrixService.createMatrix(this.newMatrix).subscribe({
      next: (matrix) => {
        this.matrices.push(matrix);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Matrix #${matrix.id} created successfully`,
        });
        this.displayCreateDialog = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create matrix',
        });
      },
    });
  }

  confirmDelete(matrix: MatrixModel): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete Matrix #${matrix.id}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteMatrix(matrix);
      },
    });
  }

  deleteMatrix(matrix: MatrixModel): void {
    this.matrixService.deleteMatrix(matrix.id!).subscribe({
      next: () => {
        this.matrices = this.matrices.filter((m) => m.id !== matrix.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Matrix #${matrix.id} deleted successfully`,
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to delete matrix',
        });
      },
    });
  }
}
