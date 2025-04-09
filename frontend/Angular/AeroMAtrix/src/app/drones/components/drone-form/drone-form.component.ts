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
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs/operators';
import { MatrixService } from '../../../matrices/services/matrix.service';
import { Drone } from '../../models/drone.model';
import { DroneService } from '../../services/drone.service';

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
    RippleModule,
  ],
  providers: [MessageService],
  animations: [
    // Fade in animation for the form content
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
  templateUrl: './drone-form.component.html',
  styleUrls: ['./drone-form.component.scss'],
})
export class DroneFormComponent implements OnInit {
  @Input() visible = false;
  @Input() droneToEdit?: Drone;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  droneForm!: FormGroup;
  matrixOptions: { label: string; value: number }[] = [];
  orientationOptions = [
    { label: 'North (N)', value: 'N' },
    { label: 'South (S)', value: 'S' },
    { label: 'East (E)', value: 'E' },
    { label: 'West (W)', value: 'W' },
  ];

  loading = false;
  submitting = false;
  submitted = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly droneService: DroneService,
    private readonly matrixService: MatrixService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMatrices();
  }

  // Initialize reactive form with validation
  initForm(): void {
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

  // Loads matrices from the MatrixService and maps them to dropdown options
  loadMatrices(): void {
    this.loading = true;
    this.matrixService
      .getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (matrices) => {
          this.matrixOptions = matrices.map((m) => ({
            label: `Matrix ${m.id} (${m.maxX}x${m.maxY})`,
            value: m.id,
          }));
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Could not load matrices',
            life: 5000,
          });
        },
      });
  }

  // Submit form: validate and send data to create or update the drone
  onSubmit(): void {
    this.submitted = true;

    if (this.droneForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please complete all required fields correctly',
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
          summary: 'Success',
          detail: `Drone ${
            this.droneToEdit ? 'updated' : 'created'
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

  // Cancel and close the form
  onCancel(): void {
    this.submitted = false;
    this.close.emit();
  }
}
