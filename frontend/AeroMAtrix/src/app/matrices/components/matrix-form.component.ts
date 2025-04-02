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
import { InputTextModule } from 'primeng/inputtext';
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
      [style]="{ width: '25vw' }"
      (onHide)="onCancel()"
    >
      <ng-template pTemplate="header">
        <span>{{ matrixToEdit ? 'Editar' : 'Crear' }} Matriz</span>
      </ng-template>

      <form [formGroup]="matrixForm" (ngSubmit)="onSubmit()">
        <div class="p-fluid">
          <label>Max X</label>
          <input pInputText type="number" formControlName="maxX" />

          <label class="mt-3">Max Y</label>
          <input pInputText type="number" formControlName="maxY" />
        </div>

        <div class="mt-4 text-right">
          <button
            pButton
            type="submit"
            label="Guardar"
            [disabled]="matrixForm.invalid"
            class="p-button-sm"
          />
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

  constructor(
    private fb: FormBuilder,
    private matrixService: MatrixService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
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
    const formValue = this.matrixForm.value;

    const request$ = this.matrixToEdit
      ? this.matrixService.update(this.matrixToEdit.id, formValue)
      : this.matrixService.create(formValue);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Matriz guardada correctamente',
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
