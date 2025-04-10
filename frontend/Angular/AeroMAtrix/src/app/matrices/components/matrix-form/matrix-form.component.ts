import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
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
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
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
    TooltipModule,
    ConfirmDialogModule,
    SkeletonModule,
    RadioButtonModule,
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

  // For matrix preview optimization
  previewMode: 'standard' | 'optimized' | 'minimal' = 'standard';
  previewCellSize = 20; // in pixels
  containerWidth = 400;
  containerHeight = 300;
  isInitialRender = true;
  previewLoading = false;
  previewVisible = true;
  useCanvasPreview = false;

  // For responsive design
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'lg';

  constructor(
    private readonly fb: FormBuilder,
    private readonly matrixService: MatrixService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkScreenSize();

    // Delay to ensure the container is rendered
    setTimeout(() => {
      this.updateContainerDimensions();
      this.determineOptimalPreviewMode();
    }, 0);
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
    this.updateContainerDimensions();
    this.determineOptimalPreviewMode();
  }

  private checkScreenSize() {
    const width = window.innerWidth;
    if (width < 576) {
      this.screenSize = 'xs';
      this.previewCellSize = 10;
    } else if (width < 768) {
      this.screenSize = 'sm';
      this.previewCellSize = 12;
    } else if (width < 992) {
      this.screenSize = 'md';
      this.previewCellSize = 15;
    } else if (width < 1200) {
      this.screenSize = 'lg';
      this.previewCellSize = 18;
    } else {
      this.screenSize = 'xl';
      this.previewCellSize = 20;
    }
  }

  private updateContainerDimensions() {
    const container = document.querySelector('.matrix-preview') as HTMLElement;
    if (container) {
      this.containerWidth = container.clientWidth;
      this.containerHeight = container.clientHeight;
    }
  }

  private determineOptimalPreviewMode() {
    const maxX = this.matrixForm.get('maxX')?.value || 3;
    const maxY = this.matrixForm.get('maxY')?.value || 3;
    const totalCells = maxX * maxY;

    // Use canvas for very large matrices
    this.useCanvasPreview = totalCells > 50;

    // Choose preview mode based on total cells
    if (totalCells <= 30) {
      this.previewMode = 'standard';
    } else if (totalCells <= 60) {
      this.previewMode = 'optimized';
    } else {
      this.previewMode = 'minimal';
    }

    // Calculate max visible cells based on container dimensions
    const maxVisibleX = Math.floor(this.containerWidth / this.previewCellSize);
    const maxVisibleY = Math.floor(this.containerHeight / this.previewCellSize);

    // Adjust cell size if needed to fit container
    if (maxX > maxVisibleX || maxY > maxVisibleY) {
      const scaleX = maxVisibleX / maxX;
      const scaleY = maxVisibleY / maxY;
      const scale = Math.min(scaleX, scaleY);
      this.previewCellSize = Math.max(
        4,
        Math.floor(this.previewCellSize * scale)
      );
    }
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
      previewMode: ['standard'],
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
        this.determineOptimalPreviewMode();
      });

      this.matrixForm.get('maxY')?.valueChanges.subscribe((newValue) => {
        if (this.matrixToEdit && newValue < this.originalMaxY) {
          this.checkForOutOfBoundsDrones();
        }
        this.determineOptimalPreviewMode();
      });
    }

    this.matrixForm.get('previewMode')?.valueChanges.subscribe((mode) => {
      this.previewMode = mode;
    });
  }

  // Check if reducing matrix size would make any drones out of bounds
  checkForOutOfBoundsDrones(): void {
    if (!this.matrixToEdit?.drones || this.matrixToEdit.drones.length === 0) {
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

    const formValue = {
      maxX: this.matrixForm.get('maxX')?.value,
      maxY: this.matrixForm.get('maxY')?.value,
    };

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

    if (this.previewMode === 'standard') {
      return Array(x * y).fill(0);
    } else if (this.previewMode === 'optimized') {
      // Create a subset of cells to represent the matrix
      const maxCells = 100;
      const totalCells = x * y;
      const factor = Math.ceil(totalCells / maxCells);

      const result: number[] = [];
      for (let i = 0; i < y; i += factor) {
        for (let j = 0; j < x; j += factor) {
          result.push(i * x + j);
        }
      }
      return result;
    } else {
      // minimal mode
      // Just show corner cells and some in between
      const result = [
        0, // top-left
        x - 1, // top-right
        (y - 1) * x, // bottom-left
        (y - 1) * x + (x - 1), // bottom-right
      ];

      // Add some cells in the middle if matrix is large enough
      if (x > 2 && y > 2) {
        const midX = Math.floor(x / 2);
        const midY = Math.floor(y / 2);
        result.push(midY * x + midX); // center
      }

      return result;
    }
  }

  // Get the cell style for a specific cell in the preview
  getCellStyle(index: number): any {
    const x = this.matrixForm.value.maxX || 3;

    if (this.previewMode === 'standard') {
      return {
        'width.%': 100 / x,
        'aspect-ratio': '1',
      };
    } else if (this.previewMode === 'optimized') {
      return {
        'width.px': this.previewCellSize,
        'height.px': this.previewCellSize,
      };
    } else {
      // minimal mode
      const extraStyles: any = {};

      if (index === 0) {
        extraStyles['border-top-left-radius'] = '4px';
        extraStyles['background-color'] = 'var(--primary-color)';
        extraStyles['opacity'] = '0.5';
      } else if (index === 1) {
        extraStyles['border-top-right-radius'] = '4px';
        extraStyles['background-color'] = 'var(--primary-color)';
        extraStyles['opacity'] = '0.5';
      } else if (index === 2) {
        extraStyles['border-bottom-left-radius'] = '4px';
        extraStyles['background-color'] = 'var(--primary-color)';
        extraStyles['opacity'] = '0.5';
      } else if (index === 3) {
        extraStyles['border-bottom-right-radius'] = '4px';
        extraStyles['background-color'] = 'var(--primary-color)';
        extraStyles['opacity'] = '0.5';
      } else if (index === 4) {
        extraStyles['background-color'] = 'var(--primary-color)';
        extraStyles['opacity'] = '0.7';
      }

      return {
        'width.px': this.previewCellSize * 2,
        'height.px': this.previewCellSize * 2,
        ...extraStyles,
      };
    }
  }

  // Get the position (x, y) for a cell in the preview
  getCellPosition(index: number): { x: number; y: number } {
    const maxX = this.matrixForm.value.maxX || 3;

    if (this.previewMode === 'standard') {
      return {
        x: index % maxX,
        y: Math.floor(index / maxX),
      };
    } else if (this.previewMode === 'optimized') {
      // For optimized mode, we need to calculate the actual positions
      const factor = Math.ceil(
        (maxX * (this.matrixForm.value.maxY || 3)) / 100
      );
      const row = Math.floor(index / Math.ceil(maxX / factor));
      const col = index % Math.ceil(maxX / factor);
      return {
        x: col * factor,
        y: row * factor,
      };
    } else {
      // minimal mode
      if (index === 0) return { x: 0, y: 0 }; // top-left
      if (index === 1) return { x: maxX - 1, y: 0 }; // top-right
      if (index === 2)
        return { x: 0, y: (this.matrixForm.value.maxY || 3) - 1 }; // bottom-left
      if (index === 3)
        return { x: maxX - 1, y: (this.matrixForm.value.maxY || 3) - 1 }; // bottom-right
      return {
        x: Math.floor(maxX / 2),
        y: Math.floor((this.matrixForm.value.maxY || 3) / 2),
      }; // center
    }
  }

  // Draw matrix preview on canvas
  drawCanvasPreview(canvas: HTMLCanvasElement): void {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxX = this.matrixForm.value.maxX || 3;
    const maxY = this.matrixForm.value.maxY || 3;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate cell size to fit canvas
    const cellWidth = canvas.width / maxX;
    const cellHeight = canvas.height / maxY;
    const cellSize = Math.min(cellWidth, cellHeight);

    // Adjust canvas size if needed to maintain aspect ratio
    canvas.width = cellSize * maxX;
    canvas.height = cellSize * maxY;

    // Draw grid
    ctx.strokeStyle = 'var(--surface-border)';
    ctx.lineWidth = 0.5;

    // Draw cells
    for (let y = 0; y < maxY; y++) {
      for (let x = 0; x < maxX; x++) {
        const xPos = x * cellSize;
        const yPos = y * cellSize;

        // Draw cell background
        ctx.fillStyle = 'var(--surface-card)';
        ctx.fillRect(xPos, yPos, cellSize, cellSize);

        // Draw cell border
        ctx.strokeRect(xPos, yPos, cellSize, cellSize);

        // Draw coordinates for bigger cells only
        if (cellSize > 12) {
          ctx.fillStyle = 'var(--text-color-secondary)';
          ctx.font = `${cellSize / 4}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${x},${y}`, xPos + cellSize / 2, yPos + cellSize / 2);
        }
      }
    }

    // Draw a border around the entire matrix
    ctx.strokeStyle = 'var(--primary-color)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
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

  // Toggle preview visibility
  togglePreview(): void {
    this.previewVisible = !this.previewVisible;
  }
}
