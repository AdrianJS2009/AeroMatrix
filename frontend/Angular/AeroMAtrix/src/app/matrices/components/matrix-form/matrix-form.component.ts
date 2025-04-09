import { animate, style, transition, trigger } from '@angular/animations';
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
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { Matrix } from '../../models/matrix.model';
import { MatrixService } from '../../services/matrix.service';

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
  templateUrl: './matrix-form.component.html',
  styleUrls: ['./matrix-form.component.scss'],
  providers: [MessageService],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
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

  // Initialize the form with default or edit values
  initForm(): void {
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

  // Handle form submission for creating or updating a matrix
  onSubmit(): void {
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

  // Cancel the form and close the dialog
  onCancel(): void {
    this.submitted = false;
    this.close.emit();
  }

  // Generate an array for the matrix preview grid based on dimensions
  getPreviewArray(): number[] {
    const x = this.matrixForm.value.maxX || 3;
    const y = this.matrixForm.value.maxY || 3;
    return Array(x * y).fill(0);
  }
}
