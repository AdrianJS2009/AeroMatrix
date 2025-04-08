import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  type OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs/operators';
import { MatrixService } from '../../../matrices/services/matrix.service';
import { Drone } from '../../models/drone.model';
import { DroneService } from '../../services/drone.service';

@Component({
  selector: 'app-drone-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    DividerModule,
    ProgressSpinnerModule,
    RippleModule,
  ],
  providers: [MessageService],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [closable]="true"
      [style]="{ width: '500px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onCancel()"
      [header]="droneToEdit ? 'Edit Drone' : 'Create New Drone'"
      styleClass="drone-form-dialog"
      [contentStyle]="{ overflow: 'visible' }"
    >
      <div
        *ngIf="loading"
        class="flex justify-content-center align-items-center"
        style="height: 200px"
      >
        <p-progressSpinner
          strokeWidth="4"
          [style]="{ width: '50px', height: '50px' }"
          aria-label="Loading matrices"
        ></p-progressSpinner>
      </div>

      <form
        *ngIf="!loading"
        [formGroup]="droneForm"
        (ngSubmit)="onSubmit()"
        class="p-fluid"
        @fadeIn
      >
        <div class="form-section">
          <h3>Drone Information</h3>

          <div class="field">
            <label for="name" class="font-bold">Name</label>
            <input
              id="name"
              pInputText
              formControlName="name"
              placeholder="Enter drone name"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  submitted && droneForm.controls['name'].invalid
              }"
              aria-describedby="name-help"
            />
            <small
              id="name-help"
              *ngIf="submitted && droneForm.controls['name'].invalid"
              class="p-error"
            >
              Name is required
            </small>
          </div>

          <div class="field">
            <label for="model" class="font-bold">Model</label>
            <input
              id="model"
              pInputText
              formControlName="model"
              placeholder="Enter drone model"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  submitted && droneForm.controls['model'].invalid
              }"
              aria-describedby="model-help"
            />
            <small
              id="model-help"
              *ngIf="submitted && droneForm.controls['model'].invalid"
              class="p-error"
            >
              Model is required
            </small>
          </div>
        </div>

        <p-divider></p-divider>

        <div class="form-section">
          <h3>Position & Orientation</h3>

          <div class="formgrid grid">
            <div class="field col">
              <label for="x" class="font-bold">X Position</label>
              <p-inputNumber
                id="x"
                formControlName="x"
                [showButtons]="true"
                [min]="0"
                [ngClass]="{
                  'ng-invalid ng-dirty':
                    submitted && droneForm.controls['x'].invalid
                }"
                aria-describedby="x-help"
              ></p-inputNumber>
              <small
                id="x-help"
                *ngIf="submitted && droneForm.controls['x'].invalid"
                class="p-error"
              >
                X position is required
              </small>
            </div>

            <div class="field col">
              <label for="y" class="font-bold">Y Position</label>
              <p-inputNumber
                id="y"
                formControlName="y"
                [showButtons]="true"
                [min]="0"
                [ngClass]="{
                  'ng-invalid ng-dirty':
                    submitted && droneForm.controls['y'].invalid
                }"
                aria-describedby="y-help"
              ></p-inputNumber>
              <small
                id="y-help"
                *ngIf="submitted && droneForm.controls['y'].invalid"
                class="p-error"
              >
                Y position is required
              </small>
            </div>
          </div>

          <div class="field">
            <label for="orientation" class="font-bold">Orientation</label>
            <p-dropdown
              id="orientation"
              [options]="orientationOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="orientation"
              placeholder="Select orientation"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  submitted && droneForm.controls['orientation'].invalid
              }"
              aria-describedby="orientation-help"
            ></p-dropdown>
            <small
              id="orientation-help"
              *ngIf="submitted && droneForm.controls['orientation'].invalid"
              class="p-error"
            >
              Orientation is required
            </small>
          </div>
        </div>

        <p-divider></p-divider>

        <div class="form-section">
          <h3>Matrix Assignment</h3>

          <div class="field">
            <label for="matrixId" class="font-bold">Matrix</label>
            <p-dropdown
              id="matrixId"
              [options]="matrixOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="matrixId"
              placeholder="Select matrix"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  submitted && droneForm.controls['matrixId'].invalid
              }"
              [filter]="true"
              filterBy="label"
              aria-describedby="matrix-help"
            ></p-dropdown>
            <small
              id="matrix-help"
              *ngIf="submitted && droneForm.controls['matrixId'].invalid"
              class="p-error"
            >
              Matrix is required
            </small>
          </div>
        </div>

        <div class="form-actions">
          <button
            pButton
            pRipple
            type="button"
            label="Cancel"
            class="p-button-outlined p-button-secondary"
            (click)="onCancel()"
            [disabled]="submitting"
          ></button>
          <button
            pButton
            pRipple
            type="submit"
            label="Save"
            icon="pi pi-check"
            [loading]="submitting"
            [disabled]="submitting"
          ></button>
        </div>
      </form>
    </p-dialog>
  `,
  styles: [
    `
      :host ::ng-deep .drone-form-dialog .p-dialog-content {
        padding: 0 1.5rem 1.5rem 1.5rem;
      }

      .form-section {
        margin-bottom: 1rem;
      }

      .form-section h3 {
        font-size: 1.1rem;
        margin-bottom: 1.25rem;
        color: var(--primary-700);
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
      }

      :host
        ::ng-deep
        .p-inputnumber-buttons-stacked
        .p-inputnumber-button-group {
        display: flex;
        flex-direction: column;
      }

      :host ::ng-deep .p-dropdown-panel .p-dropdown-items .p-dropdown-item {
        padding: 0.75rem 1.25rem;
      }

      :host ::ng-deep .p-inputtext:enabled:focus {
        box-shadow: 0 0 0 2px var(--primary-100);
        border-color: var(--primary-500);
      }

      :host ::ng-deep .p-dropdown:not(.p-disabled).p-focus {
        box-shadow: 0 0 0 2px var(--primary-100);
        border-color: var(--primary-500);
      }

      @media screen and (max-width: 576px) {
        .form-actions {
          flex-direction: column-reverse;
        }

        .form-actions button {
          width: 100%;
        }
      }
    `,
  ],
})
export class DroneFormComponent implements OnInit {
  @Input() visible = false;
  @Input() droneToEdit?: Drone;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  droneForm!: FormGroup;
  matrixOptions: { label: string; value: number }[] = [];
  orientationOptions = [
    { label: 'North (N)', value: 'N' },
    { label: 'South (S)', value: 'S' },
    { label: 'East (E)', value: 'E' },
    { label: 'West (W)', value: 'W' },
  ];

  loading = false;
  submitting = false;
  submitted = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly droneService: DroneService,
    private readonly matrixService: MatrixService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMatrices();
  }

  initForm() {
    this.droneForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      model: ['', [Validators.required, Validators.maxLength(50)]],
      x: [0, [Validators.required, Validators.min(0)]],
      y: [0, [Validators.required, Validators.min(0)]],
      orientation: ['N', Validators.required],
      matrixId: [null, Validators.required],
    });

    if (this.droneToEdit) {
      this.droneForm.patchValue(this.droneToEdit);
    }
  }

  loadMatrices() {
    this.loading = true;
    this.matrixService
      .getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (matrices) => {
          this.matrixOptions = matrices.map((m) => ({
            label: `Matrix ${m.id} (${m.maxX}x${m.maxY})`,
            value: m.id,
          }));
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Could not load matrices',
            life: 5000,
          });
        },
      });
  }

  onSubmit() {
    this.submitted = true;

    if (this.droneForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please complete all required fields correctly',
        life: 5000,
      });
      return;
    }

    const droneData = this.droneForm.value;
    this.submitting = true;

    const request$ = this.droneToEdit
      ? this.droneService.update(this.droneToEdit.id, droneData)
      : this.droneService.create(droneData);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Drone ${
            this.droneToEdit ? 'updated' : 'created'
          } successfully`,
          life: 3000,
        });
        this.submitting = false;
        this.saved.emit();
        this.close.emit();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Saving',
          detail: err.message || 'Unknown error',
          life: 5000,
        });
        this.submitting = false;
      },
    });
  }

  onCancel() {
    this.submitted = false;
    this.close.emit();
  }
}
