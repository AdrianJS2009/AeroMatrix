import {
  Component,
  EventEmitter,
  Input,
  type OnInit,
  Output,
} from '@angular/core';
import { type FormBuilder, type FormGroup, Validators } from '@angular/forms';
import type { ActivatedRoute, Router } from '@angular/router';
import type { MessageService } from 'primeng/api';
import type {
  CreateDroneRequest,
  Drone,
  UpdateDroneRequest,
} from '../../models/drone.model';
import type { Matrix } from '../../models/matrix.model';
import type { DroneService } from '../../services/drone.service';
import type { MatrixService } from '../../services/matrix.service';

@Component({
  selector: 'app-drone-form',
  templateUrl: './drone-form.component.html',
  styleUrls: ['./drone-form.component.scss'],
})
export class DroneFormComponent implements OnInit {
  @Input() matrixId?: number;
  @Output() droneCreated = new EventEmitter<Drone>();
  @Output() droneUpdated = new EventEmitter<Drone>();
  @Output() cancel = new EventEmitter<void>();

  droneForm!: FormGroup;
  isEditMode = false;
  droneId?: number;
  submitting = false;
  loading = false;
  matrices: Matrix[] = [];
  orientationOptions = [
    { label: 'North (N)', value: 'N' },
    { label: 'East (E)', value: 'E' },
    { label: 'South (S)', value: 'S' },
    { label: 'West (W)', value: 'W' },
  ];

  constructor(
    private fb: FormBuilder,
    private droneService: DroneService,
    private matrixService: MatrixService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadMatrices();
    this.initForm();

    // Check if we're in edit mode
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.droneId = +id;
        this.isEditMode = true;
        this.loadDroneDetails();
      }
    });
  }

  initForm(): void {
    this.droneForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      model: ['', [Validators.required, Validators.maxLength(100)]],
      x: [0, [Validators.required, Validators.min(0)]],
      y: [0, [Validators.required, Validators.min(0)]],
      orientation: ['N', Validators.required],
      matrixId: [this.matrixId ?? '', Validators.required],
    });

    // If matrixId is provided as input, set it in the form
    if (this.matrixId) {
      this.droneForm.get('matrixId')?.setValue(this.matrixId);
      this.droneForm.get('matrixId')?.disable();
    }
  }

  loadMatrices(): void {
    this.matrixService.listMatrices().subscribe({
      next: (data) => {
        this.matrices = data;
      },
    });
  }

  loadDroneDetails(): void {
    if (!this.droneId) return;

    this.loading = true;
    this.droneService.getDrone(this.droneId).subscribe({
      next: (drone) => {
        this.droneForm.patchValue({
          name: drone.name,
          model: drone.model,
          x: drone.x,
          y: drone.y,
          orientation: drone.orientation,
          matrixId: drone.matrixId,
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load drone details',
          life: 3000,
        });
        this.router.navigate(['/drones']);
      },
    });
  }

  onSubmit(): void {
    if (this.droneForm.invalid) {
      return;
    }

    this.submitting = true;
    const formValues = this.droneForm.getRawValue(); // Get values including disabled fields

    if (this.isEditMode && this.droneId) {
      // Update existing drone
      const updateRequest: UpdateDroneRequest = {
        name: formValues.name,
        model: formValues.model,
        x: formValues.x,
        y: formValues.y,
        orientation: formValues.orientation,
        matrixId: formValues.matrixId,
      };

      this.droneService.updateDrone(this.droneId, updateRequest).subscribe({
        next: (updatedDrone) => {
          this.submitting = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Drone updated successfully',
            life: 3000,
          });
          this.droneUpdated.emit(updatedDrone);

          // If not in a dialog, navigate back to drones list
          if (!this.cancel.observed) {
            this.router.navigate(['/drones']);
          }
        },
        error: () => {
          this.submitting = false;
        },
      });
    } else {
      // Create new drone
      const createRequest: CreateDroneRequest = {
        name: formValues.name,
        model: formValues.model,
        x: formValues.x,
        y: formValues.y,
        orientation: formValues.orientation,
        matrixId: formValues.matrixId,
      };

      this.droneService.createDrone(createRequest).subscribe({
        next: (newDrone) => {
          this.submitting = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Drone created successfully',
            life: 3000,
          });
          this.droneCreated.emit(newDrone);

          // If not in a dialog, navigate back to drones list
          if (!this.cancel.observed) {
            this.router.navigate(['/drones']);
          }
        },
        error: () => {
          this.submitting = false;
        },
      });
    }
  }

  onCancel(): void {
    if (this.cancel.observed) {
      this.cancel.emit();
    } else {
      this.router.navigate(['/drones']);
    }
  }
}
