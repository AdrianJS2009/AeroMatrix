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
import { ToastModule } from 'primeng/toast';
import { MatrixService } from '../../matrices/services/matrix.service';
import { Drone } from '../models/drone.model';
import { DroneService } from '../services/drone.service';

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
  ],
  providers: [MessageService],
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [closable]="true"
      [style]="{ width: '450px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onCancel()"
      [header]="droneToEdit ? 'Editar Dron' : 'Crear Nuevo Dron'"
    >
      <div
        *ngIf="loading"
        class="flex justify-content-center align-items-center"
        style="height: 200px"
      >
        <p-progressSpinner
          strokeWidth="4"
          [style]="{ width: '50px', height: '50px' }"
        ></p-progressSpinner>
      </div>

      <form
        *ngIf="!loading"
        [formGroup]="droneForm"
        (ngSubmit)="onSubmit()"
        class="p-fluid"
      >
        <div class="field">
          <label for="name" class="font-bold">Nombre</label>
          <input
            id="name"
            pInputText
            formControlName="name"
            placeholder="Ingrese nombre del dron"
            [ngClass]="{
              'ng-invalid ng-dirty':
                submitted && droneForm.controls['name'].invalid
            }"
          />
          <small
            *ngIf="submitted && droneForm.controls['name'].invalid"
            class="p-error"
          >
            El nombre es requerido
          </small>
        </div>

        <div class="field">
          <label for="model" class="font-bold">Modelo</label>
          <input
            id="model"
            pInputText
            formControlName="model"
            placeholder="Ingrese modelo del dron"
            [ngClass]="{
              'ng-invalid ng-dirty':
                submitted && droneForm.controls['model'].invalid
            }"
          />
          <small
            *ngIf="submitted && droneForm.controls['model'].invalid"
            class="p-error"
          >
            El modelo es requerido
          </small>
        </div>

        <div class="formgrid grid">
          <div class="field col">
            <label for="x" class="font-bold">Posición X</label>
            <p-inputNumber
              id="x"
              formControlName="x"
              [showButtons]="true"
              [min]="0"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  submitted && droneForm.controls['x'].invalid
              }"
            ></p-inputNumber>
            <small
              *ngIf="submitted && droneForm.controls['x'].invalid"
              class="p-error"
            >
              Posición X requerida
            </small>
          </div>

          <div class="field col">
            <label for="y" class="font-bold">Posición Y</label>
            <p-inputNumber
              id="y"
              formControlName="y"
              [showButtons]="true"
              [min]="0"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  submitted && droneForm.controls['y'].invalid
              }"
            ></p-inputNumber>
            <small
              *ngIf="submitted && droneForm.controls['y'].invalid"
              class="p-error"
            >
              Posición Y requerida
            </small>
          </div>
        </div>

        <div class="field">
          <label for="orientation" class="font-bold">Orientación</label>
          <p-dropdown
            id="orientation"
            [options]="orientationOptions"
            optionLabel="label"
            optionValue="value"
            formControlName="orientation"
            placeholder="Seleccione orientación"
            [ngClass]="{
              'ng-invalid ng-dirty':
                submitted && droneForm.controls['orientation'].invalid
            }"
          ></p-dropdown>
          <small
            *ngIf="submitted && droneForm.controls['orientation'].invalid"
            class="p-error"
          >
            La orientación es requerida
          </small>
        </div>

        <div class="field">
          <label for="matrixId" class="font-bold">Matriz</label>
          <p-dropdown
            id="matrixId"
            [options]="matrixOptions"
            optionLabel="label"
            optionValue="value"
            formControlName="matrixId"
            placeholder="Seleccione matriz"
            [ngClass]="{
              'ng-invalid ng-dirty':
                submitted && droneForm.controls['matrixId'].invalid
            }"
            [filter]="true"
            filterBy="label"
          ></p-dropdown>
          <small
            *ngIf="submitted && droneForm.controls['matrixId'].invalid"
            class="p-error"
          >
            La matriz es requerida
          </small>
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
export class DroneFormComponent implements OnInit {
  @Input() visible = false;
  @Input() droneToEdit?: Drone;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  droneForm!: FormGroup;
  matrixOptions: { label: string; value: number }[] = [];
  orientationOptions = [
    { label: 'Norte (N)', value: 'N' },
    { label: 'Sur (S)', value: 'S' },
    { label: 'Este (E)', value: 'E' },
    { label: 'Oeste (O)', value: 'O' },
  ];

  loading = false;
  submitting = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private droneService: DroneService,
    private matrixService: MatrixService,
    private messageService: MessageService
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
    this.matrixService.getAll().subscribe({
      next: (matrices) => {
        this.matrixOptions = matrices.map((m) => ({
          label: `Matriz ${m.id} (${m.maxX}x${m.maxY})`,
          value: m.id,
        }));
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las matrices',
          life: 5000,
        });
        this.loading = false;
      },
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.droneForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'Por favor complete todos los campos requeridos correctamente',
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
          summary: 'Éxito',
          detail: `Dron ${
            this.droneToEdit ? 'actualizado' : 'creado'
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
