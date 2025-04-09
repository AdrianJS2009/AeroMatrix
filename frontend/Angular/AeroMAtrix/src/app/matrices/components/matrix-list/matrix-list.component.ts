import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Matrix } from '../../models/matrix.model';
import { MatrixService } from '../../services/matrix.service';
import { MatrixFormComponent } from '../matrix-form/matrix-form.component';

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
    BadgeModule,
    RippleModule,
    TooltipModule,
    DividerModule,
  ],
  templateUrl: './matrix-list.component.html',
  styleUrls: ['./matrix-list.component.scss'],
  providers: [MessageService, ConfirmationService],
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
    trigger('rowAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
  ],
})
export class MatrixListComponent implements OnInit {
  matrices: Matrix[] = [];
  formVisible = false;
  selectedMatrix?: Matrix;
  loading = true;

  constructor(
    private readonly matrixService: MatrixService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadMatrices();
  }

  // Load matrices from the API
  loadMatrices(): void {
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
          detail: err.message || 'Matrices could not be loaded',
          life: 5000,
        });
        this.loading = false;
      },
    });
  }

  // Confirm deletion of a matrix
  confirmDelete(matrix: Matrix): void {
    if (matrix.drones.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cannot Delete',
        detail:
          'This matrix has drones assigned to it. Remove the drones first.',
        life: 5000,
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to delete matrix ${matrix.id}?`,
      accept: () => this.deleteMatrix(matrix.id),
    });
  }

  // Delete a matrix by id
  deleteMatrix(id: number): void {
    this.matrixService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Matrix Deleted',
          detail: `Matrix ID ${id} deleted successfully`,
          life: 3000,
        });
        this.loadMatrices();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Deleting',
          detail: err.message || 'Unexpected error',
          life: 5000,
        });
      },
    });
  }

  // Open the matrix form dialog for create or edit
  openForm(matrix?: Matrix): void {
    this.selectedMatrix = matrix;
    this.formVisible = true;
  }

  // Close the matrix form dialog
  closeForm(): void {
    this.selectedMatrix = undefined;
    this.formVisible = false;
  }
}
