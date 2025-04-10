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
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { Drone } from '../../../drones/models/drone.model';
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
    ConfirmDialogModule,
  ],
  templateUrl: './matrix-form.component.html',
  styleUrls: ['./matrix-form.component.scss'],
  providers: [MessageService, ConfirmationService],
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
  Math = Math; // Add Math object for use in template

  // Track original dimensions when editing
  originalMaxX = 0;
  originalMaxY = 0;

  // Track out-of-bounds drones
  outOfBoundsDrones: Drone[] = [];

  // Constants for validation
  readonly MAX_DIMENSION = 100;

  constructor(
    private readonly fb: FormBuilder,
    private readonly matrixService: MatrixService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  // Initialize the form with default or edit values
  initForm(): void {
    this.matrixForm = this.fb.group({
      maxX: [
        3,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(this.MAX_DIMENSION),
        ],
      ],
      maxY: [
        3,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(this.MAX_DIMENSION),
        ],
      ],
    });

    if (this.matrixToEdit) {
      this.originalMaxX = this.matrixToEdit.maxX;
      this.originalMaxY = this.matrixToEdit.maxY;

      this.matrixForm.patchValue({
        maxX: this.matrixToEdit.maxX,
        maxY: this.matrixToEdit.maxY,
      });

      // Add value change listeners to check for out-of-bounds drones when editing
      this.matrixForm.get('maxX')?.valueChanges.subscribe((newValue) => {
        if (this.matrixToEdit && newValue < this.originalMaxX) {
          this.checkForOutOfBoundsDrones();
        }
      });

      this.matrixForm.get('maxY')?.valueChanges.subscribe((newValue) => {
        if (this.matrixToEdit && newValue < this.originalMaxY) {
          this.checkForOutOfBoundsDrones();
        }
      });
    }
  }

  // Check if reducing matrix size would make any drones out of bounds
  checkForOutOfBoundsDrones(): void {
    if (
      !this.matrixToEdit ||
      !this.matrixToEdit.drones ||
      this.matrixToEdit.drones.length === 0
    ) {
      this.outOfBoundsDrones = [];
      return;
    }

    const newMaxX = this.matrixForm.get('maxX')?.value;
    const newMaxY = this.matrixForm.get('maxY')?.value;

    // Find drones that would be out of bounds with new dimensions
    this.outOfBoundsDrones = this.matrixToEdit.drones.filter(
      (drone) => drone.x >= newMaxX || drone.y >= newMaxY
    );
  }

  // Get formatted list of out-of-bounds drones for display
  getOutOfBoundsDronesMessage(): string {
    if (this.outOfBoundsDrones.length === 0) return '';

    const droneList = this.outOfBoundsDrones
      .map((drone) => `"${drone.name}" at position (${drone.x}, ${drone.y})`)
      .join(', ');

    return `The following drones would be out of bounds: ${droneList}.`;
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

    // Check for out-of-bounds drones when editing
    if (this.matrixToEdit) {
      this.checkForOutOfBoundsDrones();

      if (this.outOfBoundsDrones.length > 0) {
        this.confirmationService.confirm({
          header: 'Cannot Resize Matrix',
          message: `Reducing the matrix size would cause drones to be out of bounds. ${this.getOutOfBoundsDronesMessage()} Please relocate these drones before resizing the matrix.`,
          icon: 'pi pi-exclamation-triangle',
          acceptVisible: false,
          rejectLabel: 'OK',
          reject: () => {
            // Reset form to original values
            this.matrixForm.patchValue({
              maxX: this.originalMaxX,
              maxY: this.originalMaxY,
            });
          },
        });
        return;
      }
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

  // Check if the matrix dimensions have been reduced
  isDimensionReduced(): boolean {
    if (!this.matrixToEdit) return false;

    const newMaxX = this.matrixForm.get('maxX')?.value;
    const newMaxY = this.matrixForm.get('maxY')?.value;

    return newMaxX < this.originalMaxX || newMaxY < this.originalMaxY;
  }

  // Get validation error message for dimensions
  getDimensionErrorMessage(dimension: string): string {
    const control = this.matrixForm.get(dimension);

    if (control?.hasError('required')) {
      return `${dimension === 'maxX' ? 'Width' : 'Height'} is required`;
    }

    if (control?.hasError('min')) {
      return `${dimension === 'maxX' ? 'Width' : 'Height'} must be at least 1`;
    }

    if (control?.hasError('max')) {
      return `${dimension === 'maxX' ? 'Width' : 'Height'} cannot exceed ${
        this.MAX_DIMENSION
      }`;
    }

    return '';
  }
}
