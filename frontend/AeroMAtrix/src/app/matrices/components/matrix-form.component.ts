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
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { Matrix } from '../models/matrix.model';
import { MatrixService } from '../services/matrix.service';

@Component({
  selector: 'app-matrix-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
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
      [style]="{ width: '450px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onCancel()"
      [header]="matrixToEdit ? 'Edit Matrix' : 'Create New Matrix'"
      styleClass="matrix-form-dialog"
    >
      <div
        *ngIf="loading"
        class="flex justify-content-center align-items-center"
        style="height: 150px"
      >
        <p-progressSpinner
          strokeWidth="4"
          [style]="{ width: '50px', height: '50px' }"
        ></p-progressSpinner>
      </div>

      <form
        *ngIf="!loading"
        [formGroup]="matrixForm"
        (ngSubmit)="onSubmit()"
        class="p-fluid"
        @fadeIn
      >
        <div class="form-section">
          <h3>Matrix Dimensions</h3>
          <p class="section-description">
            Define the size of your operational matrix
          </p>

          <div class="formgrid grid">
            <div class="field col">
              <label for="maxX" class="font-bold">X Dimension</label>
              <p-inputNumber
                id="maxX"
                formControlName="maxX"
                [showButtons]="true"
                [min]="1"
                [ngClass]="{
                  'ng-invalid ng-dirty':
                    submitted && matrixForm.controls['maxX'].invalid
                }"
              ></p-inputNumber>
              <small
                *ngIf="submitted && matrixForm.controls['maxX'].invalid"
                class="p-error"
              >
                X dimension must be greater than 0
              </small>
            </div>

            <div class="field col">
              <label for="maxY" class="font-bold">Y Dimension</label>
              <p-inputNumber
                id="maxY"
                formControlName="maxY"
                [showButtons]="true"
                [min]="1"
                [ngClass]="{
                  'ng-invalid ng-dirty':
                    submitted && matrixForm.controls['maxY'].invalid
                }"
              ></p-inputNumber>
              <small
                *ngIf="submitted && matrixForm.controls['maxY'].invalid"
                class="p-error"
              >
                Y dimension must be greater than 0
              </small>
            </div>
          </div>

          <div class="matrix-preview">
            <div class="preview-label">Preview:</div>
            <div
              class="preview-grid"
              [style.--grid-cols]="matrixForm.value.maxX"
              [style.--grid-rows]="matrixForm.value.maxY"
            >
              <div
                class="preview-cell"
                *ngFor="let _ of getPreviewArray()"
              ></div>
            </div>
            <div class="preview-info">
              {{ matrixForm.value.maxX }} × {{ matrixForm.value.maxY }} =
              {{ matrixForm.value.maxX * matrixForm.value.maxY }} cells
            </div>
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
      :host ::ng-deep .matrix-form-dialog .p-dialog-content {
        padding: 0 1.5rem 1.5rem 1.5rem;
      }

      .form-section {
        margin-bottom: 1.5rem;
      }

      .form-section h3 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        color: var(--primary-700);
      }

      .section-description {
        color: var(--text-color-secondary);
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
      }

      .matrix-preview {
        margin-top: 1.5rem;
        padding: 1rem;
        background-color: var(--surface-ground);
        border-radius: 8px;
      }

      .preview-label {
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: var(--text-color-secondary);
      }

      .preview-grid {
        display: grid;
        grid-template-columns: repeat(var(--grid-cols, 3), 20px);
        grid-template-rows: repeat(var(--grid-rows, 3), 20px);
        gap: 2px;
        margin-bottom: 0.75rem;
      }

      .preview-cell {
        background-color: var(--primary-200);
        border-radius: 2px;
      }

      .preview-info {
        font-size: 0.875rem;
        color: var(--text-color-secondary);
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
export class MatrixFormComponent implements OnInit {
  @Input() visible = false;
  @Input() matrixToEdit?: Matrix;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  matrixForm!: FormGroup;
  loading = false;
  submitting = false;
  submitted = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly matrixService: MatrixService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.matrixForm = this.fb.group({
      maxX: [3, [Validators.required, Validators.min(1)]],
      maxY: [3, [Validators.required, Validators.min(1)]],
    });

    if (this.matrixToEdit) {
      this.matrixForm.patchValue({
        maxX: this.matrixToEdit.maxX,
        maxY: this.matrixToEdit.maxY,
      });
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.matrixForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please complete all required fields correctly',
        life: 5000,
      });
      return;
    }

    const formValue = this.matrixForm.value;
    this.submitting = true;

    const request$ = this.matrixToEdit
      ? this.matrixService.update(this.matrixToEdit.id, formValue)
      : this.matrixService.create(formValue);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Matrix ${
            this.matrixToEdit ? 'updated' : 'created'
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

  getPreviewArray(): number[] {
    const x = this.matrixForm.value.maxX || 3;
    const y = this.matrixForm.value.maxY || 3;
    return Array(x * y).fill(0);
  }
}
