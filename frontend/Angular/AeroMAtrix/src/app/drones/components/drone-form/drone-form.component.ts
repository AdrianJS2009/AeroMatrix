import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  type OnChanges,
  type OnInit,
  Output,
  type SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { finalize } from 'rxjs/operators';

import { Matrix } from '../../../matrices/models/matrix.model';
import { MatrixService } from '../../../matrices/services/matrix.service';
import { Drone } from '../../models/drone.model';
import { DroneService } from '../../services/drone.service';

@Component({
  selector: 'app-drone-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    RippleModule,
    InputNumberModule,
    ProgressSpinnerModule,
    DividerModule,
  ],
  templateUrl: './drone-form.component.html',
  styleUrls: ['./drone-form.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class DroneFormComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() droneToEdit?: Drone;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<Drone>();
  @Output() close = new EventEmitter<void>();

  droneForm!: FormGroup;
  matrices: Matrix[] = [];
  matrixOptions: { label: string; value: number }[] = [];
  orientationOptions = [
    { label: 'North', value: 'N' },
    { label: 'South', value: 'S' },
    { label: 'East', value: 'E' },
    { label: 'West', value: 'W' },
  ];

  loading = false;
  submitting = false;
  submitted = false;

  selectedMatrixId?: number;
  selectedMatrixMaxX = 9;
  selectedMatrixMaxY = 9;
  positionOccupied = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly droneService: DroneService,
    private readonly matrixService: MatrixService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMatrices();

    // Add value change listeners for position validation
    this.droneForm
      .get('x')
      ?.valueChanges.subscribe(() => this.checkPositionOccupied());
    this.droneForm
      .get('y')
      ?.valueChanges.subscribe(() => this.checkPositionOccupied());
    this.droneForm
      .get('matrixId')
      ?.valueChanges.subscribe(() => this.onMatrixChange());
  }

  // Fix for Issue #4: Edit Modal Re-opening
  // Implement OnChanges to react to input changes
  ngOnChanges(changes: SimpleChanges): void {
    // If the visibility or droneToEdit changes, reinitialize the form
    if (
      (changes['visible'] && changes['visible'].currentValue) ||
      (changes['droneToEdit'] && !changes['droneToEdit'].firstChange)
    ) {
      if (this.droneForm) {
        this.initForm();

        // If matrices are already loaded, update the form with drone data
        if (this.matrices.length > 0 && this.droneToEdit) {
          this.patchFormWithDroneData();
        }
      }
    }
  }

  initForm(): void {
    this.droneForm = this.fb.group({
      name: ['', [Validators.required]],
      model: ['', [Validators.required]],
      x: [0, [Validators.required, Validators.min(0)]],
      y: [0, [Validators.required, Validators.min(0)]],
      orientation: ['N', [Validators.required]],
      matrixId: [null, [Validators.required]],
    });

    if (this.droneToEdit) {
      this.selectedMatrixId = this.droneToEdit.matrixId;
    }
  }

  // Helper method to patch form with drone data
  patchFormWithDroneData(): void {
    if (!this.droneToEdit) return;

    this.droneForm.patchValue({
      name: this.droneToEdit.name,
      model: this.droneToEdit.model,
      x: this.droneToEdit.x,
      y: this.droneToEdit.y,
      orientation: this.droneToEdit.orientation,
      matrixId: this.droneToEdit.matrixId,
    });

    // Disable matrix and orientation fields when editing
    this.droneForm.get('matrixId')?.disable();
    this.droneForm.get('orientation')?.disable();

    this.updateMatrixBounds();
    this.checkPositionOccupied();
  }

  loadMatrices(): void {
    this.loading = true;
    this.matrixService
      .getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (matrices) => {
          this.matrices = matrices;
          // Format matrix options as "Matrix ID: [ID] - [Dimensions]"
          this.matrixOptions = matrices.map((matrix) => ({
            label: `Matrix ID: ${matrix.id} - ${matrix.maxX}x${matrix.maxY}`,
            value: matrix.id,
          }));

          // If editing a drone, patch the form values after matrices are loaded
          if (this.droneToEdit) {
            this.patchFormWithDroneData();
          }
        },
        error: (err) => {
          console.error('Error loading matrices:', err);
        },
      });
  }

  onMatrixChange(): void {
    this.selectedMatrixId = this.droneForm.get('matrixId')?.value;
    this.updateMatrixBounds();
    this.checkPositionOccupied();
  }

  updateMatrixBounds(): void {
    if (this.selectedMatrixId) {
      const selectedMatrix = this.matrices.find(
        (m) => m.id === this.selectedMatrixId
      );
      if (selectedMatrix) {
        this.selectedMatrixMaxX = selectedMatrix.maxX - 1;
        this.selectedMatrixMaxY = selectedMatrix.maxY - 1;

        // Update validators for x and y
        this.droneForm
          .get('x')
          ?.setValidators([
            Validators.required,
            Validators.min(0),
            Validators.max(this.selectedMatrixMaxX),
          ]);

        this.droneForm
          .get('y')
          ?.setValidators([
            Validators.required,
            Validators.min(0),
            Validators.max(this.selectedMatrixMaxY),
          ]);

        this.droneForm.get('x')?.updateValueAndValidity();
        this.droneForm.get('y')?.updateValueAndValidity();
      }
    }
  }

  checkPositionOccupied(): void {
    if (!this.selectedMatrixId) {
      this.positionOccupied = false;
      return;
    }

    const x = this.droneForm.get('x')?.value;
    const y = this.droneForm.get('y')?.value;

    if (x === null || y === null) {
      this.positionOccupied = false;
      return;
    }

    const selectedMatrix = this.matrices.find(
      (m) => m.id === this.selectedMatrixId
    );
    if (!selectedMatrix) {
      this.positionOccupied = false;
      return;
    }

    // Check if any drone (except the one being edited) occupies this position
    this.positionOccupied = selectedMatrix.drones.some(
      (drone) =>
        drone.x === x &&
        drone.y === y &&
        (!this.droneToEdit || drone.id !== this.droneToEdit.id)
    );
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.droneForm.invalid) {
      return;
    }

    // Create a copy of the form value that includes disabled controls
    const formValues = {
      ...this.droneForm.getRawValue(),
    };

    const droneData: Drone = {
      id: this.droneToEdit?.id ?? 0,
      ...formValues,
    };

    this.submitting = true;
    const request = this.droneToEdit
      ? this.droneService.update(this.droneToEdit.id, droneData)
      : this.droneService.create(droneData);

    request.pipe(finalize(() => (this.submitting = false))).subscribe({
      next: (drone) => {
        this.saved.emit(drone);
        this.onCancel();
      },
      error: (err) => {
        console.error('Error saving drone:', err);
      },
    });
  }

  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.close.emit();
    this.submitted = false;
    this.droneForm.reset({
      orientation: 'N',
    });
  }
}
