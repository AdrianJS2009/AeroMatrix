import {
  Component,
  EventEmitter,
  Input,
  type OnInit,
  Output,
} from '@angular/core';
import { type FormBuilder, type FormGroup, Validators } from '@angular/forms';
import type {
  CreateMatrixRequest,
  Matrix,
  UpdateMatrixRequest,
} from '../../models/matrix.model';
import type { MatrixService } from '../../services/matrix.service';

@Component({
  selector: 'app-matrix-form',
  templateUrl: './matrix-form.component.html',
  styleUrls: ['./matrix-form.component.scss'],
})
export class MatrixFormComponent implements OnInit {
  @Input() matrix?: Matrix;
  @Output() matrixCreated = new EventEmitter<Matrix>();
  @Output() matrixUpdated = new EventEmitter<Matrix>();
  @Output() cancel = new EventEmitter<void>();

  matrixForm!: FormGroup;
  submitting = false;

  constructor(private fb: FormBuilder, private matrixService: MatrixService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.matrixForm = this.fb.group({
      maxX: [
        this.matrix?.maxX ?? 5,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      maxY: [
        this.matrix?.maxY ?? 5,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
    });
  }

  onSubmit(): void {
    if (this.matrixForm.invalid) {
      return;
    }

    this.submitting = true;
    const formValues = this.matrixForm.value;

    if (this.matrix) {
      // Update existing matrix
      const updateRequest: UpdateMatrixRequest = {
        maxX: formValues.maxX,
        maxY: formValues.maxY,
      };

      this.matrixService.updateMatrix(this.matrix.id, updateRequest).subscribe({
        next: (updatedMatrix) => {
          this.submitting = false;
          this.matrixUpdated.emit(updatedMatrix);
        },
        error: () => {
          this.submitting = false;
        },
      });
    } else {
      // Create new matrix
      const createRequest: CreateMatrixRequest = {
        maxX: formValues.maxX,
        maxY: formValues.maxY,
      };

      this.matrixService.createMatrix(createRequest).subscribe({
        next: (newMatrix) => {
          this.submitting = false;
          this.matrixCreated.emit(newMatrix);
        },
        error: () => {
          this.submitting = false;
        },
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
