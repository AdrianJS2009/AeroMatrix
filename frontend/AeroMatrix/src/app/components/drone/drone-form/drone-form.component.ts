import {
  Component,
  EventEmitter,
  Input,
  type OnInit,
  Output,
} from '@angular/core';
import { type FormBuilder, type FormGroup, Validators } from '@angular/forms';
import {
  type CreateDroneRequest,
  type DroneModel,
  Orientation,
  type UpdateDroneRequest,
} from '../../../models/drone.model';
import type { MatrixModel } from '../../../models/matrix.model';

@Component({
  selector: 'app-drone-form',
  templateUrl: './drone-form.component.html',
  styleUrls: ['./drone-form.component.css'],
})
export class DroneFormComponent implements OnInit {
  @Input() drone: DroneModel | null = null;
  @Input() matrices: MatrixModel[] = [];
  @Input() isEdit = false;
  @Output() formSubmit = new EventEmitter<
    CreateDroneRequest | UpdateDroneRequest
  >();
  @Output() cancel = new EventEmitter<void>();

  droneForm!: FormGroup;

  orientationOptions = [
    { label: 'North', value: Orientation.NORTH },
    { label: 'East', value: Orientation.EAST },
    { label: 'South', value: Orientation.SOUTH },
    { label: 'West', value: Orientation.WEST },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.droneForm = this.fb.group({
      name: [this.drone?.name ?? '', [Validators.required]],
      model: [this.drone?.model ?? 'Standard', [Validators.required]],
      x: [this.drone?.x ?? 0, [Validators.required, Validators.min(0)]],
      y: [this.drone?.y ?? 0, [Validators.required, Validators.min(0)]],
      orientation: [
        this.drone?.orientation ?? Orientation.NORTH,
        [Validators.required],
      ],
      matrixId: [
        this.drone?.matrixId ??
          (this.matrices.length > 0 ? this.matrices[0].id : null),
        [Validators.required],
      ],
    });
  }

  onSubmit(): void {
    if (this.droneForm.valid) {
      this.formSubmit.emit(this.droneForm.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getMatrixName(matrixId: number): string {
    const matrix = this.matrices.find((m) => m.id === matrixId);
    return matrix
      ? `Matrix #${matrix.id} (${matrix.maxX}x${matrix.maxY})`
      : `Matrix #${matrixId}`;
  }
}
