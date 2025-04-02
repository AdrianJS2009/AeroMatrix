import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Drone } from '../models/drone.model';
import { DroneService } from '../services/drone.service';
import { DroneFormComponent } from './drone-form.component';

@Component({
  standalone: true,
  selector: 'app-drone-list',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    DroneFormComponent,
    ConfirmDialogModule,
    CardModule,
    TagModule,
    SkeletonModule,
    TooltipModule,
    InputTextModule,
    BadgeModule,
    AvatarModule,
    RippleModule,
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
    <div class="drone-list-container" @fadeIn>
      <div class="page-header">
        <div class="header-content">
          <div>
            <h1>Drone Management</h1>
            <p>View and manage your drone fleet</p>
          </div>
          <button
            pButton
            pRipple
            icon="pi pi-plus"
            label="New Drone"
            (click)="openForm()"
            class="p-button-rounded"
            pTooltip="Add a new drone"
            tooltipPosition="left"
          ></button>
        </div>
      </div>

      <div class="card-container">
        <p-card styleClass="drone-list-card">
          <div class="table-header">
            <div class="table-title">
              <i class="pi pi-send"></i>
              <h2>Drone Fleet</h2>
              <p-badge
                [value]="drones.length.toString()"
                severity="info"
                styleClass="drone-count"
              ></p-badge>
            </div>
            <span class="p-input-icon-left search-input">
              <i class="pi pi-search"></i>
              <input
                pInputText
                type="text"
                placeholder="Search drones..."
                (input)="onSearch($event)"
              />
            </span>
          </div>

          <p-table
            [value]="drones"
            [paginator]="true"
            [rows]="10"
            [rowsPerPageOptions]="[5, 10, 25]"
            [loading]="loading"
            styleClass="p-datatable-gridlines p-datatable-striped p-datatable-sm"
            [tableStyle]="{ 'min-width': '50rem' }"
            responsiveLayout="scroll"
            [rowHover]="true"
            dataKey="id"
            [globalFilterFields]="['name', 'model']"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} drones"
          >
            <ng-template pTemplate="header">
              <tr>
                <th pSortableColumn="id" style="width: 5rem">
                  ID <p-sortIcon field="id"></p-sortIcon>
                </th>
                <th pSortableColumn="name">
                  Name <p-sortIcon field="name"></p-sortIcon>
                </th>
                <th pSortableColumn="model">
                  Model <p-sortIcon field="model"></p-sortIcon>
                </th>
                <th>Position</th>
                <th>Orientation</th>
                <th pSortableColumn="matrixId">
                  Matrix <p-sortIcon field="matrixId"></p-sortIcon>
                </th>
                <th style="width: 8rem">Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-drone>
              <tr @rowAnimation>
                <td>
                  <p-avatar
                    [label]="drone.id.toString()"
                    shape="circle"
                    [style]="{
                      'background-color': getAvatarColor(drone.id),
                      color: '#ffffff'
                    }"
                    size="normal"
                  ></p-avatar>
                </td>
                <td>
                  <div class="drone-name">{{ drone.name }}</div>
                </td>
                <td>{{ drone.model }}</td>
                <td>
                  <p-tag
                    [value]="'(' + drone.x + ', ' + drone.y + ')'"
                    [rounded]="true"
                    severity="info"
                  ></p-tag>
                </td>
                <td>
                  <p-tag
                    [value]="getOrientationLabel(drone.orientation)"
                    [rounded]="true"
                    [severity]="getOrientationSeverity(drone.orientation)"
                  ></p-tag>
                </td>
                <td>
                  <p-badge
                    [value]="drone.matrixId.toString()"
                    styleClass="matrix-badge"
                  ></p-badge>
                </td>
                <td>
                  <div class="action-buttons">
                    <button
                      pButton
                      pRipple
                      icon="pi pi-pencil"
                      class="p-button-rounded p-button-text p-button-sm"
                      (click)="openForm(drone)"
                      pTooltip="Edit"
                      tooltipPosition="top"
                    ></button>
                    <button
                      pButton
                      pRipple
                      icon="pi pi-trash"
                      class="p-button-rounded p-button-text p-button-sm p-button-danger"
                      (click)="confirmDelete(drone)"
                      pTooltip="Delete"
                      tooltipPosition="top"
                    ></button>
                  </div>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="7" class="text-center p-4">
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
                    <span>No drones found</span>
                    <button
                      pButton
                      label="Create New Drone"
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

      <app-drone-form
        [visible]="formVisible"
        [droneToEdit]="selectedDrone"
        (saved)="loadDrones()"
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
      .drone-list-container {
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

      :host ::ng-deep .drone-list-card .p-card-body {
        padding: 0;
      }

      :host ::ng-deep .drone-list-card .p-card-content {
        padding: 0;
      }

      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--surface-border);
        flex-wrap: wrap;
        gap: 1rem;
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

      .search-input {
        width: 100%;
        max-width: 300px;
      }

      .drone-name {
        font-weight: 600;
        color: var(--primary-700);
      }

      .action-buttons {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
      }

      :host ::ng-deep .drone-count {
        margin-left: 0.5rem;
      }

      :host ::ng-deep .matrix-badge {
        background-color: var(--primary-600);
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

        .search-input {
          width: 100%;
          max-width: none;
        }
      }
    `,
  ],
})
export class DroneListComponent implements OnInit {
  drones: Drone[] = [];
  filteredDrones: Drone[] = [];
  formVisible = false;
  selectedDrone?: Drone;
  loading = true;

  constructor(
    private readonly droneService: DroneService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadDrones();
  }

  loadDrones() {
    this.loading = true;
    this.droneService.getAll().subscribe({
      next: (data) => {
        this.drones = data;
        this.filteredDrones = data;
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

  confirmDelete(drone: Drone) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete drone "${drone.name}"?`,
      accept: () => this.deleteDrone(drone.id),
    });
  }

  deleteDrone(id: number) {
    this.droneService.delete(id).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Drone Deleted',
          detail: response.message || `Drone ID ${id} deleted successfully`,
          life: 3000,
        });
        this.loadDrones();
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

  openForm(drone?: Drone) {
    this.selectedDrone = drone;
    this.formVisible = true;
  }

  closeForm() {
    this.selectedDrone = undefined;
    this.formVisible = false;
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    if (!filterValue) {
      this.filteredDrones = this.drones;
      return;
    }

    this.filteredDrones = this.drones.filter(
      (drone) =>
        drone.name.toLowerCase().includes(filterValue) ||
        drone.model.toLowerCase().includes(filterValue)
    );
  }

  getOrientationLabel(orientation: string): string {
    const labels = {
      N: 'North',
      S: 'South',
      E: 'East',
      W: 'West',
      O: 'West',
    };
    return labels[orientation as keyof typeof labels] || orientation;
  }

  getOrientationSeverity(
    orientation: string
  ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    const map = {
      N: 'success',
      S: 'warning',
      E: 'info',
      W: 'contrast',
      O: 'contrast',
    } as const;

    return map[orientation as keyof typeof map] || 'success';
  }

  getAvatarColor(id: number): string {
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
}
