import { Component, type OnInit } from '@angular/core';
import type { Router } from '@angular/router';
import type { ConfirmationService, MessageService } from 'primeng/api';
import type { Matrix } from '../../models/matrix.model';
import type { MatrixService } from '../../services/matrix.service';

@Component({
  selector: 'app-matrix-list',
  templateUrl: './matrix-list.component.html',
  styleUrls: ['./matrix-list.component.scss'],
})
export class MatrixListComponent implements OnInit {
  matrices: Matrix[] = [];
  loading = false;
  displayCreateDialog = false;

  constructor(
    private matrixService: MatrixService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMatrices();
  }

  loadMatrices(): void {
    this.loading = true;
    this.matrixService.listMatrices().subscribe({
      next: (data) => {
        this.matrices = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  viewMatrix(matrix: Matrix): void {
    this.router.navigate(['/matrices', matrix.id]);
  }

  deleteMatrix(matrix: Matrix): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete matrix #${matrix.id}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.matrixService.deleteMatrix(matrix.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Matrix deleted successfully',
              life: 3000,
            });
            this.loadMatrices();
          },
        });
      },
    });
  }

  showCreateDialog(): void {
    this.displayCreateDialog = true;
  }

  hideCreateDialog(): void {
    this.displayCreateDialog = false;
  }

  onMatrixCreated(): void {
    this.hideCreateDialog();
    this.loadMatrices();
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Matrix created successfully',
      life: 3000,
    });
  }
}
