import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
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
    BadgeModule,
    RippleModule,
    TooltipModule,
  ],
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
  template: `
    <div class="matrix-list-container" @fadeIn>
      <div class="page-header">
        <div class="header-content">
          <div>
            <h1>Matrix Management</h1>
            <p>Configure operational boundaries for your drone fleet</p>
          </div>
          <button
            pButton
            pRipple
            icon="pi pi-plus"
            label="New Matrix"
            (click)="openForm()"
            class="p-button-rounded"
            pTooltip="Add a new matrix"
            tooltipPosition="left"
          ></button>
        </div>
      </div>

      <div class="card-container">
        <p-card styleClass="matrix-list-card">
          <div class="table-header">
            <div class="table-title">
              <i class="pi pi-th-large"></i>
              <h2>Matrix Configurations</h2>
              <p-badge
                [value]="matrices.length.toString()"
                severity="info"
                styleClass="matrix-count"
              ></p-badge>
            </div>
          </div>

          <p-table
            [value]="matrices"
            [paginator]="true"
            [rows]="10"
            [rowsPerPageOptions]="[5, 10, 25]"
            [loading]="loading"
            styleClass="p-datatable-gridlines p-datatable-striped p-datatable-sm"
            [tableStyle]="{ 'min-width': '50rem' }"
            responsiveLayout="scroll"
            [rowHover]="true"
          >
            <ng-template pTemplate="header">
              <tr>
                <th pSortableColumn="id" style="width: 5rem">
                  ID <p-sortIcon field="id"></p-sortIcon>
                </th>
                <th>Dimensions</th>
                <th>Drones</th>
                <th style="width: 8rem">Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-matrix>
              <tr @rowAnimation>
                <td>
                  <p-badge
                    [value]="matrix.id.toString()"
                    styleClass="matrix-id-badge"
                  ></p-badge>
                </td>
                <td>
                  <div class="matrix-dimensions">
                    <p-tag
                      [value]="matrix.maxX + ' x ' + matrix.maxY"
                      [rounded]="true"
                      severity="info"
                      icon="pi pi-th-large"
                    ></p-tag>
                    <span class="dimensions-label"
                      >{{ matrix.maxX * matrix.maxY }} cells total</span
                    >
                  </div>
                </td>
                <td>
                  <div *ngIf="matrix.drones.length === 0" class="no-drones">
                    <i class="pi pi-info-circle"></i>
                    <span>No drones assigned</span>
                  </div>
                  <div *ngIf="matrix.drones.length > 0" class="drone-chips">
                    <p-chip
                      *ngFor="let drone of matrix.drones.slice(0, 3)"
                      [label]="
                        drone.name + ' (' + drone.x + ',' + drone.y + ')'
                      "
                      styleClass="drone-chip"
                    ></p-chip>
                    <p-chip
                      *ngIf="matrix.drones.length > 3"
                      [label]="'+ ' + (matrix.drones.length - 3) + ' more'"
                      styleClass="more-chip"
                    ></p-chip>
                  </div>
                </td>
                <td>
                  <div class="action-buttons">
                    <button
                      pButton
                      pRipple
                      icon="pi pi-pencil"
                      class="p-button-rounded p-button-text p-button-sm"
                      (click)="openForm(matrix)"
                      pTooltip="Edit"
                      tooltipPosition="top"
                    ></button>
                    <button
                      pButton
                      pRipple
                      icon="pi pi-trash"
                      class="p-button-rounded p-button-text p-button-sm p-button-danger"
                      (click)="confirmDelete(matrix)"
                      pTooltip="Delete"
                      tooltipPosition="top"
                      [disabled]="matrix.drones.length > 0"
                    ></button>
                  </div>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="4" class="text-center p-4">
                  <div
                    *ngIf="loading"
                    class="flex flex-column align-items-center"
                  >
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
                  <div *ngIf="!loading" class="empty-message">
                    <i class="pi pi-inbox empty-icon"></i>
                    <span>No matrices found</span>
                    <button
                      pButton
                      pRipple
                      label="Create New Matrix"
                      icon="pi pi-plus"
                      class="p-button-sm"
                      (click)="openForm()"
                    ></button>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>
      </div>

      <app-matrix-form
        [visible]="formVisible"
        [matrixToEdit]="selectedMatrix"
        (saved)="loadMatrices()"
        (close)="closeForm()"
      />

      <p-confirmDialog
        header="Confirm Deletion"
        icon="pi pi-exclamation-triangle"
        acceptLabel="Yes, delete"
        rejectLabel="Cancel"
        acceptButtonStyleClass="p-button-danger"
      ></p-confirmDialog>

      <p-toast></p-toast>
    </div>
  `,
  styles: [
    `
      .matrix-list-container {
        padding: 1rem;
      }

      .page-header {
        margin-bottom: 2rem;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
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

      .card-container {
        margin-bottom: 2rem;
      }

      :host ::ng-deep .matrix-list-card .p-card-body {
        padding: 0;
      }

      :host ::ng-deep .matrix-list-card .p-card-content {
        padding: 0;
      }

      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--surface-border);
      }

      .table-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .table-title h2 {
        margin: 0;
        font-size: 1.25rem;
      }

      .table-title i {
        font-size: 1.25rem;
        color: var(--primary-color);
      }

      :host ::ng-deep .matrix-count {
        margin-left: 0.5rem;
      }

      :host ::ng-deep .matrix-id-badge {
        background-color: var(--primary-600);
      }

      .matrix-dimensions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .dimensions-label {
        font-size: 0.875rem;
        color: var(--text-color-secondary);
      }

      .no-drones {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-color-secondary);
        font-style: italic;
      }

      .drone-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      :host ::ng-deep .drone-chip {
        background-color: var(--primary-100);
        color: var(--primary-700);
      }

      :host ::ng-deep .more-chip {
        background-color: var(--primary-500);
        color: var(--primary-color-text);
      }

      .action-buttons {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
      }

      .empty-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 2rem;
      }

      .empty-icon {
        font-size: 3rem;
        color: var(--surface-500);
      }

      @media screen and (max-width: 768px) {
        .table-header {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
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
          detail: err.message || 'Matrices could not be loaded',
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

  deleteMatrix(id: number) {
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

  openForm(matrix?: Matrix) {
    this.selectedMatrix = matrix;
    this.formVisible = true;
  }

  closeForm() {
    this.selectedMatrix = undefined;
    this.formVisible = false;
  }
}
