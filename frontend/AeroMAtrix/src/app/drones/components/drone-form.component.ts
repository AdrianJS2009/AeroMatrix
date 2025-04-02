import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
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
    DropdownModule,
    ButtonModule,
    DialogModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <p-dialog
      [(visible)]="visible"
      modal
      [closable]="true"
      [style]="{ width: '30vw' }"
      (onHide)="onCancel()"
    >
      <ng-template pTemplate="header">
        <span>{{ droneToEdit ? 'Editar' : 'Crear' }} Dron</span>
      </ng-template>

      <form [formGroup]="droneForm" (ngSubmit)="onSubmit()">
        <div class="p-fluid">
          <label for="name">Nombre</label>
          <input id="name" pInputText formControlName="name" />

          <label for="model" class="mt-3">Modelo</label>
          <input id="model" pInputText formControlName="model" />

          <label class="mt-3">Posición X</label>
          <input pInputText type="number" formControlName="x" />

          <label class="mt-3">Posición Y</label>
          <input pInputText type="number" formControlName="y" />

          <label class="mt-3">Orientación</label>
          <input pInputText formControlName="orientation" />

          <label class="mt-3">Matriz</label>
          <p-dropdown
            [options]="matrixOptions"
            optionLabel="label"
            optionValue="value"
            formControlName="matrixId"
            placeholder="Selecciona matriz"
          ></p-dropdown>
        </div>

        <div class="mt-4 text-right">
          <button
            pButton
            type="submit"
            label="Guardar"
            [disabled]="droneForm.invalid"
            class="p-button-sm"
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

  constructor(
    private fb: FormBuilder,
    private droneService: DroneService,
    private matrixService: MatrixService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.droneForm = this.fb.group({
      name: ['', Validators.required],
      model: ['', Validators.required],
      x: [0, Validators.required],
      y: [0, Validators.required],
      orientation: ['', Validators.required],
      matrixId: [null, Validators.required],
    });

    this.loadMatrices();

    if (this.droneToEdit) {
      this.droneForm.patchValue(this.droneToEdit);
    }
  }

  loadMatrices() {
    this.matrixService.getAll().subscribe((matrices) => {
      this.matrixOptions = matrices.map((m) => ({
        label: `Matriz ${m.id} (${m.maxX}x${m.maxY})`,
        value: m.id,
      }));
    });
  }

  onSubmit() {
    const droneData = this.droneForm.value;

    const request$ = this.droneToEdit
      ? this.droneService.update(this.droneToEdit.id, droneData)
      : this.droneService.create(droneData);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Dron guardado correctamente',
        });
        this.saved.emit();
        this.close.emit();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al guardar',
          detail: err.error?.message || 'Error desconocido',
        });
      },
    });
  }

  onCancel() {
    this.close.emit();
  }
}
