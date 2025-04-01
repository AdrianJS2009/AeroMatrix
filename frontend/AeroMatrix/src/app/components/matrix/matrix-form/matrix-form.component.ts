import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  type OnInit,
  Output,
} from '@angular/core';
import {
  type FormBuilder,
  type FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import type {
  CreateMatrixRequest,
  MatrixModel,
  UpdateMatrixRequest,
} from '../../../models/matrix.model';

@Component({
  selector: 'app-matrix-form',
  templateUrl: './matrix-form.component.html',
  styleUrls: ['./matrix-form.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
  ],
  standalone: false,
})
export class MatrixFormComponent implements OnInit {
  @Input() matrix: MatrixModel | null = null;
  @Input() isEdit = false;
  @Output() formSubmit = new EventEmitter<
    CreateMatrixRequest | UpdateMatrixRequest
  >();
  @Output() cancel = new EventEmitter<void>();

  matrixForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.matrixForm = this.fb.group({
      maxX: [
        this.matrix?.maxX || 10,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      maxY: [
        this.matrix?.maxY || 10,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
    });
  }

  onSubmit(): void {
    if (this.matrixForm.valid) {
      this.formSubmit.emit(this.matrixForm.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
