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
  ],
  providers: [MessageService],
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [closable]="true"
      [style]="{ width: '400px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onCancel()"
      [header]="matrixToEdit ? 'Editar Matriz' : 'Crear Nueva Matriz'"
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
      >
        <div class="formgrid grid">
          <div class="field col">
            <label for="maxX" class="font-bold">Dimensión X</label>
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
              Dimensión X debe ser mayor a 0
            </small>
          </div>

          <div class="field col">
            <label for="maxY" class="font-bold">Dimensión Y</label>
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
              Dimensión Y debe ser mayor a 0
            </small>
          </div>
        </div>

        <p-divider></p-divider>

        <div class="flex justify-content-end gap-2">
          <button
            pButton
            type="button"
            label="Cancelar"
            class="p-button-outlined p-button-secondary"
            (click)="onCancel()"
            [disabled]="submitting"
          ></button>
          <button
            pButton
            type="submit"
            label="Guardar"
            [loading]="submitting"
            [disabled]="submitting"
          ></button>
        </div>
      </form>
    </p-dialog>
  `,
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
    private fb: FormBuilder,
    private matrixService: MatrixService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.matrixForm = this.fb.group({
      maxX: [1, [Validators.required, Validators.min(1)]],
      maxY: [1, [Validators.required, Validators.min(1)]],
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
        summary: 'Error de validación',
        detail: 'Por favor complete todos los campos requeridos correctamente',
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
          summary: 'Éxito',
          detail: `Matriz ${
            this.matrixToEdit ? 'actualizada' : 'creada'
          } correctamente`,
          life: 3000,
        });
        this.submitting = false;
        this.saved.emit();
        this.close.emit();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al guardar',
          detail: err.message || 'Error desconocido',
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
