import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  Output,
  ViewChild,
  type AfterViewInit,
  type ElementRef,
  type OnChanges,
  type OnDestroy,
  type OnInit,
  type SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { Drone } from '../../drones/models/drone.model';
import { Matrix } from '../../matrices/models/matrix.model';

// Import Three.js
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-drone-matrix',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule,
    SliderModule,
    FormsModule,
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
  template: `
    <div class="matrix-container" @fadeIn>
      <div class="matrix-controls">
        <div class="control-group">
          <button
            pButton
            icon="pi pi-plus"
            class="p-button-rounded p-button-outlined"
            (click)="zoomIn()"
            pTooltip="Zoom In"
          ></button>
          <button
            pButton
            icon="pi pi-minus"
            class="p-button-rounded p-button-outlined"
            (click)="zoomOut()"
            pTooltip="Zoom Out"
          ></button>
          <button
            pButton
            icon="pi pi-refresh"
            class="p-button-rounded p-button-outlined"
            (click)="resetView()"
            pTooltip="Reset View"
          ></button>
        </div>

        <div class="view-options">
          <button
            pButton
            [icon]="view3D ? 'pi pi-table' : 'pi pi-cube'"
            [label]="view3D ? '2D View' : '3D View'"
            class="p-button-sm p-button-outlined"
            (click)="toggleView()"
          ></button>

          <button
            pButton
            [icon]="showLabels ? 'pi pi-eye-slash' : 'pi pi-eye'"
            [label]="showLabels ? 'Hide Labels' : 'Show Labels'"
            class="p-button-sm p-button-outlined"
            (click)="toggleLabels()"
          ></button>
        </div>
      </div>

      <!-- 2D Matrix View -->
      <div
        class="matrix-viewport"
        #viewport
        *ngIf="!view3D"
        (mousedown)="startPan($event)"
        (mousemove)="pan($event)"
        (mouseup)="endPan()"
        (mouseleave)="endPan()"
        (wheel)="onWheel($event)"
      >
        <div
          class="matrix-grid"
          [style.transform]="
            'scale(' + scale + ') translate(' + panX + 'px, ' + panY + 'px)'
          "
          [style.width.px]="cellSize * (matrix?.maxX || 1)"
          [style.height.px]="cellSize * (matrix?.maxY || 1)"
        >
          <!-- Grid Lines -->
          <div class="grid-lines">
            <div class="horizontal-lines">
              <div
                class="grid-line horizontal"
                *ngFor="let y of getArrayFromSize(matrix?.maxY || 0)"
                [style.top.px]="y * cellSize"
              ></div>
            </div>
            <div class="vertical-lines">
              <div
                class="grid-line vertical"
                *ngFor="let x of getArrayFromSize(matrix?.maxX || 0)"
                [style.left.px]="x * cellSize"
              ></div>
            </div>
          </div>

          <!-- Coordinate Labels -->
          <ng-container *ngIf="showLabels">
            <!-- X-axis labels -->
            <div
              class="coordinate-label x-label"
              *ngFor="let x of getArrayFromSize(matrix?.maxX || 0)"
              [style.left.px]="(x + 0.5) * cellSize"
              [style.top.px]="-25"
            >
              {{ x }}
            </div>

            <!-- Y-axis labels -->
            <div
              class="coordinate-label y-label"
              *ngFor="let y of getArrayFromSize(matrix?.maxY || 0)"
              [style.top.px]="(y + 0.5) * cellSize"
              [style.left.px]="-25"
            >
              {{ y }}
            </div>
          </ng-container>

          <!-- Drones -->
          <ng-container *ngFor="let drone of drones">
            <div
              class="drone"
              [ngClass]="{
                selected: drone.id === selectedDroneId,
                'drone-north': drone.orientation === 'N',
                'drone-south': drone.orientation === 'S',
                'drone-east': drone.orientation === 'E',
                'drone-west':
                  drone.orientation === 'W' || drone.orientation === 'O'
              }"
              [style.left.px]="drone.x * cellSize"
              [style.top.px]="drone.y * cellSize"
              [style.width.px]="cellSize"
              [style.height.px]="cellSize"
              (click)="selectDrone(drone)"
              @scaleIn
            >
              <div class="drone-body">
                <div class="drone-propeller propeller-1"></div>
                <div class="drone-propeller propeller-2"></div>
                <div class="drone-propeller propeller-3"></div>
                <div class="drone-propeller propeller-4"></div>

                <div class="drone-direction-indicator"></div>

                <div
                  class="drone-info"
                  *ngIf="showLabels || drone.id === selectedDroneId"
                >
                  <span class="drone-id">{{ drone.name }}</span>
                  <span class="drone-position"
                    >({{ drone.x }}, {{ drone.y }})</span
                  >
                </div>
              </div>
            </div>
          </ng-container>
        </div>
      </div>

      <!-- 3D Matrix View -->
      <div class="matrix-3d-container" #container3d *ngIf="view3D">
        <!-- Three.js will render here -->
      </div>

      <div class="matrix-info">
        <div class="info-item">
          <span class="info-label">Matrix:</span>
          <span class="info-value">{{ matrix?.id || 'None' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Dimensions:</span>
          <span class="info-value"
            >{{ matrix?.maxX || 0 }}x{{ matrix?.maxY || 0 }}</span
          >
        </div>
        <div class="info-item">
          <span class="info-label">Drones:</span>
          <span class="info-value">{{ drones?.length || 0 }}</span>
        </div>
        <div class="info-item" *ngIf="selectedDroneId">
          <span class="info-label">Selected:</span>
          <span class="info-value">{{ getSelectedDroneName() }}</span>
        </div>
        <div class="info-item" *ngIf="view3D">
          <span class="info-label">View:</span>
          <span class="info-value">3D (Use mouse to rotate and zoom)</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .matrix-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: var(--surface-card);
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        overflow: hidden;
      }

      .matrix-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: var(--surface-section);
        border-bottom: 1px solid var(--surface-border);
        z-index: 10;
      }

      .control-group {
        display: flex;
        gap: 0.5rem;
      }

      .view-options {
        display: flex;
        gap: 0.5rem;
      }

      .matrix-viewport {
        flex: 1;
        position: relative;
        overflow: hidden;
        background-color: var(--surface-ground);
        cursor: grab;
      }

      .matrix-viewport:active {
        cursor: grabbing;
      }

      .matrix-3d-container {
        flex: 1;
        position: relative;
        overflow: hidden;
        background-color: var(--surface-ground);
      }

      .matrix-grid {
        position: absolute;
        top: 50%;
        left: 50%;
        transform-origin: center;
        transition: transform 0.2s ease;
        will-change: transform;
      }

      .grid-lines {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .grid-line {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.1);
      }

      .grid-line.horizontal {
        width: 100%;
        height: 1px;
      }

      .grid-line.vertical {
        height: 100%;
        width: 1px;
      }

      .coordinate-label {
        position: absolute;
        font-size: 0.75rem;
        color: var(--text-color-secondary);
        transform: translate(-50%, -50%);
        pointer-events: none;
        font-weight: 600;
      }

      .drone {
        position: absolute;
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        cursor: pointer;
        z-index: 10;
      }

      .drone-body {
        position: relative;
        width: 80%;
        height: 80%;
        top: 10%;
        left: 10%;
        background-color: var(--primary-500);
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .drone:hover .drone-body {
        transform: scale(1.05);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      }

      .drone.selected .drone-body {
        background-color: var(--primary-700);
        box-shadow: 0 0 0 3px var(--primary-300), 0 8px 16px rgba(0, 0, 0, 0.3);
        animation: pulse 2s infinite;
      }

      .drone-propeller {
        position: absolute;
        width: 30%;
        height: 5%;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 2px;
      }

      .propeller-1 {
        top: 10%;
        left: 35%;
        animation: spin 0.5s linear infinite;
      }

      .propeller-2 {
        top: 47.5%;
        left: 10%;
        transform: rotate(90deg);
        animation: spin 0.5s linear infinite;
      }

      .propeller-3 {
        top: 85%;
        left: 35%;
        animation: spin 0.5s linear infinite;
      }

      .propeller-4 {
        top: 47.5%;
        left: 60%;
        transform: rotate(90deg);
        animation: spin 0.5s linear infinite;
      }

      .drone-direction-indicator {
        position: absolute;
        width: 0;
        height: 0;
        border-style: solid;
        transition: all 0.3s ease;
      }

      .drone-north .drone-direction-indicator {
        border-width: 0 8px 16px 8px;
        border-color: transparent transparent rgba(255, 255, 255, 0.9)
          transparent;
        top: 10%;
        left: 50%;
        transform: translateX(-50%);
      }

      .drone-south .drone-direction-indicator {
        border-width: 16px 8px 0 8px;
        border-color: rgba(255, 255, 255, 0.9) transparent transparent
          transparent;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
      }

      .drone-east .drone-direction-indicator {
        border-width: 8px 0 8px 16px;
        border-color: transparent transparent transparent
          rgba(255, 255, 255, 0.9);
        top: 50%;
        right: 10%;
        transform: translateY(-50%);
      }

      .drone-west .drone-direction-indicator {
        border-width: 8px 16px 8px 0;
        border-color: transparent rgba(255, 255, 255, 0.9) transparent
          transparent;
        top: 50%;
        left: 10%;
        transform: translateY(-50%);
      }

      .drone-info {
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        white-space: nowrap;
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 20;
      }

      .drone:hover .drone-info,
      .drone.selected .drone-info {
        opacity: 1;
      }

      .matrix-info {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        padding: 1rem;
        background-color: var(--surface-section);
        border-top: 1px solid var(--surface-border);
      }

      .info-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .info-label {
        font-weight: 600;
        color: var(--text-color-secondary);
      }

      .info-value {
        color: var(--text-color);
        background-color: var(--surface-hover);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: monospace;
      }

      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 3px var(--primary-300),
            0 8px 16px rgba(0, 0, 0, 0.3);
        }
        50% {
          box-shadow: 0 0 0 6px var(--primary-200),
            0 8px 16px rgba(0, 0, 0, 0.3);
        }
        100% {
          box-shadow: 0 0 0 3px var(--primary-300),
            0 8px 16px rgba(0, 0, 0, 0.3);
        }
      }

      @keyframes spin {
        0% {
          transform: rotateY(0deg);
        }
        100% {
          transform: rotateY(360deg);
        }
      }

      @media screen and (max-width: 768px) {
        .matrix-controls {
          flex-direction: column;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .view-options {
          width: 100%;
          justify-content: space-between;
        }
      }
    `,
  ],
})
export class DroneMatrixComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() matrix?: Matrix;
  @Input() drones: Drone[] = [];
  @Input() selectedDroneId?: number;
  @Output() droneSelected = new EventEmitter<Drone>();

  @ViewChild('viewport') viewportRef!: ElementRef;
  @ViewChild('container3d') container3dRef!: ElementRef;

  // 2D view properties
  cellSize = 80; // Size of each cell in pixels
  scale = 1; // Current zoom level
  panX = 0; // Current pan X position
  panY = 0; // Current pan Y position
  isPanning = false; // Whether user is currently panning
  startPanX = 0; // Starting X position for pan
  startPanY = 0; // Starting Y position for pan
  lastPanX = 0; // Last X position for pan
  lastPanY = 0; // Last Y position for pan
  view3D = false; // Whether to show 3D view
  showLabels = true; // Whether to show coordinate labels

  // Three.js properties
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private droneModels: Map<number, THREE.Object3D> = new Map();
  private gridHelper!: THREE.GridHelper;
  private animationFrameId?: number;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.resetView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['matrix'] && this.matrix) {
      // Reset view when matrix changes
      this.resetView();

      // Update 3D view if active
      if (this.view3D && this.scene) {
        this.updateThreeJsScene();
      }
    }

    if (changes['drones'] && this.view3D && this.scene) {
      this.updateDronePositions();
    }

    if (changes['selectedDroneId'] && this.view3D && this.scene) {
      this.updateSelectedDrone();
    }
  }

  ngAfterViewInit(): void {
    if (this.view3D) {
      this.initThreeJs();
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Clean up Three.js resources
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  getArrayFromSize(size: number): number[] {
    return Array.from({ length: size }, (_, i) => i);
  }

  selectDrone(drone: Drone): void {
    this.droneSelected.emit(drone);
  }

  getSelectedDroneName(): string {
    const drone = this.drones.find((d) => d.id === this.selectedDroneId);
    return drone ? drone.name : '';
  }

  zoomIn(): void {
    if (this.view3D) {
      // Zoom in for 3D view
      if (this.controls) {
        this.controls.dollyIn(1.2);
        this.controls.update();
      }
    } else {
      // Zoom in for 2D view
      this.scale = Math.min(this.scale * 1.2, 3);
    }
  }

  zoomOut(): void {
    if (this.view3D) {
      // Zoom out for 3D view
      if (this.controls) {
        this.controls.dollyOut(1.2);
        this.controls.update();
      }
    } else {
      // Zoom out for 2D view
      this.scale = Math.max(this.scale / 1.2, 0.3);
    }
  }

  resetView(): void {
    if (this.view3D) {
      // Reset 3D view
      if (this.controls) {
        this.controls.reset();
      }
    } else {
      // Reset 2D view
      this.scale = 1;
      this.panX = 0;
      this.panY = 0;
      this.lastPanX = 0;
      this.lastPanY = 0;

      // Center the matrix in the viewport
      if (this.matrix) {
        setTimeout(() => this.centerMatrix(), 0);
      }
    }
  }

  centerMatrix(): void {
    if (!this.viewportRef || !this.matrix) return;

    const viewport = this.viewportRef.nativeElement;
    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;

    const matrixWidth = this.matrix.maxX * this.cellSize;
    const matrixHeight = this.matrix.maxY * this.cellSize;

    // Center the matrix in the viewport
    this.panX = (viewportWidth - matrixWidth) / 2 / this.scale;
    this.panY = (viewportHeight - matrixHeight) / 2 / this.scale;
    this.lastPanX = this.panX;
    this.lastPanY = this.panY;
  }

  startPan(event: MouseEvent): void {
    this.isPanning = true;
    this.startPanX = event.clientX;
    this.startPanY = event.clientY;
  }

  pan(event: MouseEvent): void {
    if (!this.isPanning) return;

    const deltaX = event.clientX - this.startPanX;
    const deltaY = event.clientY - this.startPanY;

    this.panX = this.lastPanX + deltaX / this.scale;
    this.panY = this.lastPanY + deltaY / this.scale;
  }

  endPan(): void {
    if (this.isPanning) {
      this.isPanning = false;
      this.lastPanX = this.panX;
      this.lastPanY = this.panY;
    }
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (this.view3D) return; // Handled by OrbitControls in 3D mode

    event.preventDefault();

    // Get mouse position relative to the viewport
    const rect = this.viewportRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate position in the scaled/panned coordinate system
    const oldScale = this.scale;

    // Adjust scale based on wheel direction
    if (event.deltaY < 0) {
      this.scale = Math.min(this.scale * 1.1, 3); // Zoom in
    } else {
      this.scale = Math.max(this.scale / 1.1, 0.3); // Zoom out
    }

    // Adjust pan to zoom toward mouse position
    const scaleFactor = this.scale / oldScale;
    const panAdjustX = mouseX / oldScale - mouseX / this.scale;
    const panAdjustY = mouseY / oldScale - mouseY / this.scale;

    this.panX = this.lastPanX + panAdjustX;
    this.panY = this.lastPanY + panAdjustY;
    this.lastPanX = this.panX;
    this.lastPanY = this.panY;
  }

  toggleView(): void {
    this.view3D = !this.view3D;

    if (this.view3D) {
      // Initialize Three.js when switching to 3D view
      setTimeout(() => {
        this.initThreeJs();
      }, 0);
    } else {
      // Clean up Three.js resources when switching to 2D view
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }

      if (this.renderer) {
        this.renderer.dispose();
      }

      // Reset and center 2D view
      setTimeout(() => {
        this.resetView();
      }, 0);
    }
  }

  toggleLabels(): void {
    this.showLabels = !this.showLabels;

    if (this.view3D && this.scene) {
      // Toggle labels in 3D view
      this.updateLabels();
    }
  }

  // Three.js methods
  private initThreeJs(): void {
    if (!this.container3dRef) return;

    const container = this.container3dRef.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8f9fa); // Light background color

    // Create camera
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Add orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);

    // Create the scene content
    this.createSceneContent();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());

    // Start animation loop
    this.ngZone.runOutsideAngular(() => this.animate());
  }

  private createSceneContent(): void {
    if (!this.matrix) return;

    // Create grid
    const gridSize = Math.max(this.matrix.maxX, this.matrix.maxY);
    this.gridHelper = new THREE.GridHelper(gridSize, gridSize);
    this.scene.add(this.gridHelper);

    // Create grid plane
    const planeGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xf0f0f0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = -0.01; // Slightly below the grid
    this.scene.add(plane);

    // Add coordinate axes
    const axesHelper = new THREE.AxesHelper(gridSize / 2);
    this.scene.add(axesHelper);

    // Add drones
    this.createDroneModels();

    // Position camera to view the entire grid
    this.camera.position.set(gridSize, gridSize, gridSize);
    this.controls.update();
  }

  private createDroneModels(): void {
    // Clear existing drone models
    this.droneModels.forEach((model) => {
      this.scene.remove(model);
    });
    this.droneModels.clear();

    // Create new drone models
    this.drones.forEach((drone) => {
      // Create drone model
      const droneGroup = new THREE.Group();

      // Create drone body
      const bodyGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.6);
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: drone.id === this.selectedDroneId ? 0x0059a6 : 0x0d8de3,
        shininess: 100,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      droneGroup.add(body);

      // Create propellers
      const propellerGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.05);
      const propellerMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
      });

      // Top-left propeller
      const propeller1 = new THREE.Mesh(propellerGeometry, propellerMaterial);
      propeller1.position.set(-0.25, 0.1, -0.25);
      droneGroup.add(propeller1);

      // Top-right propeller
      const propeller2 = new THREE.Mesh(propellerGeometry, propellerMaterial);
      propeller2.position.set(0.25, 0.1, -0.25);
      propeller2.rotation.y = Math.PI / 2;
      droneGroup.add(propeller2);

      // Bottom-left propeller
      const propeller3 = new THREE.Mesh(propellerGeometry, propellerMaterial);
      propeller3.position.set(-0.25, 0.1, 0.25);
      propeller3.rotation.y = Math.PI / 2;
      droneGroup.add(propeller3);

      // Bottom-right propeller
      const propeller4 = new THREE.Mesh(propellerGeometry, propellerMaterial);
      propeller4.position.set(0.25, 0.1, 0.25);
      droneGroup.add(propeller4);

      // Create direction indicator
      const directionGeometry = new THREE.ConeGeometry(0.15, 0.3, 8);
      const directionMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
      });
      const directionIndicator = new THREE.Mesh(
        directionGeometry,
        directionMaterial
      );

      // Position and rotate based on orientation
      switch (drone.orientation) {
        case 'N':
          directionIndicator.position.set(0, 0.1, -0.4);
          directionIndicator.rotation.x = Math.PI / 2;
          break;
        case 'S':
          directionIndicator.position.set(0, 0.1, 0.4);
          directionIndicator.rotation.x = -Math.PI / 2;
          break;
        case 'E':
          directionIndicator.position.set(0.4, 0.1, 0);
          directionIndicator.rotation.z = Math.PI / 2;
          break;
        case 'W':
        case 'O': // Handle legacy 'O' for Oeste (West in Spanish)
          directionIndicator.position.set(-0.4, 0.1, 0);
          directionIndicator.rotation.z = -Math.PI / 2;
          break;
      }

      droneGroup.add(directionIndicator);

      // Add label if needed
      if (this.showLabels || drone.id === this.selectedDroneId) {
        this.addDroneLabel(droneGroup, drone);
      }

      // Position the drone
      droneGroup.position.set(drone.x, 0.2, drone.y);

      // Add to scene and store reference
      this.scene.add(droneGroup);
      this.droneModels.set(drone.id, droneGroup);

      // Add selection effect if this is the selected drone
      if (drone.id === this.selectedDroneId) {
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0x4dabf7,
          transparent: true,
          opacity: 0.3,
        });
        const glowGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        glowMesh.scale.set(1.2, 0.8, 1.2);
        droneGroup.add(glowMesh);

        // Add animation data
        (droneGroup as any).userData = {
          glowMesh,
          glowFactor: 0,
          glowDirection: 1,
        };
      }
    });

    // Update the camera to include all drones
    this.updateCameraPosition();
  }

  private addDroneLabel(droneGroup: THREE.Group, drone: Drone): void {
    // Create canvas for the label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = 256;
    canvas.height = 128;

    // Draw background
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.font = 'bold 24px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(drone.name, canvas.width / 2, 40);

    context.font = '20px Arial';
    context.fillText(`(${drone.x}, ${drone.y})`, canvas.width / 2, 80);

    // Create texture and sprite
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 1, 1);
    sprite.position.set(0, 1, 0);

    droneGroup.add(sprite);
  }

  private updateDronePositions(): void {
    this.drones.forEach((drone) => {
      const droneModel = this.droneModels.get(drone.id);
      if (droneModel) {
        // Animate to new position
        const targetPosition = new THREE.Vector3(drone.x, 0.2, drone.y);

        // Create animation
        const currentPosition = droneModel.position.clone();
        const distance = currentPosition.distanceTo(targetPosition);

        // If significant distance, animate
        if (distance > 0.01) {
          // Store animation data
          (droneModel as any).userData = {
            ...(droneModel as any).userData,
            startPosition: currentPosition,
            targetPosition,
            animationProgress: 0,
          };
        } else {
          // Just update position
          droneModel.position.copy(targetPosition);
        }

        // Update orientation
        this.updateDroneOrientation(droneModel, drone.orientation);
      } else {
        // Create new drone model if it doesn't exist
        this.createDroneModels();
      }
    });
  }

  private updateDroneOrientation(
    droneModel: THREE.Object3D,
    orientation: string
  ): void {
    // Find the direction indicator (cone)
    const directionIndicator = droneModel.children.find(
      (child) =>
        child instanceof THREE.Mesh &&
        (child.geometry as THREE.BufferGeometry).type === 'ConeGeometry'
    );

    if (directionIndicator) {
      // Reset rotation
      directionIndicator.rotation.set(0, 0, 0);

      // Position and rotate based on orientation
      switch (orientation) {
        case 'N':
          directionIndicator.position.set(0, 0.1, -0.4);
          directionIndicator.rotation.x = Math.PI / 2;
          break;
        case 'S':
          directionIndicator.position.set(0, 0.1, 0.4);
          directionIndicator.rotation.x = -Math.PI / 2;
          break;
        case 'E':
          directionIndicator.position.set(0.4, 0.1, 0);
          directionIndicator.rotation.z = Math.PI / 2;
          break;
        case 'W':
        case 'O': // Handle legacy 'O' for Oeste (West in Spanish)
          directionIndicator.position.set(-0.4, 0.1, 0);
          directionIndicator.rotation.z = -Math.PI / 2;
          break;
      }
    }
  }

  private updateSelectedDrone(): void {
    // Update all drone models to reflect selection state
    this.droneModels.forEach((model, droneId) => {
      // Get the body mesh (first child)
      const body = model.children.find(
        (child) =>
          child instanceof THREE.Mesh &&
          (child.geometry as THREE.BufferGeometry).type === 'BoxGeometry'
      );

      if (body && body instanceof THREE.Mesh) {
        const material = body.material as THREE.MeshPhongMaterial;

        // Update color based on selection
        if (droneId === this.selectedDroneId) {
          material.color.set(0x0059a6); // Darker blue for selected

          // Add glow effect if not already present
          if (
            !model.children.some(
              (child) =>
                child instanceof THREE.Mesh &&
                child.material instanceof THREE.MeshBasicMaterial &&
                child.material.transparent
            )
          ) {
            const glowMaterial = new THREE.MeshBasicMaterial({
              color: 0x4dabf7,
              transparent: true,
              opacity: 0.3,
            });
            const glowGeometry = new THREE.SphereGeometry(0.6, 16, 16);
            const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
            glowMesh.scale.set(1.2, 0.8, 1.2);
            model.add(glowMesh);

            // Add animation data
            (model as any).userData = {
              ...(model as any).userData,
              glowMesh,
              glowFactor: 0,
              glowDirection: 1,
            };
          }

          // Update label visibility
          this.updateDroneLabel(model, droneId, true);
        } else {
          material.color.set(0x0d8de3); // Regular blue for unselected

          // Remove glow effect if present
          const glowMesh = model.children.find(
            (child) =>
              child instanceof THREE.Mesh &&
              child.material instanceof THREE.MeshBasicMaterial &&
              child.material.transparent
          );

          if (glowMesh) {
            model.remove(glowMesh);
          }

          // Update label visibility
          this.updateDroneLabel(model, droneId, this.showLabels);
        }
      }
    });
  }

  private updateDroneLabel(
    droneModel: THREE.Object3D,
    droneId: number,
    visible: boolean
  ): void {
    // Find the sprite label
    const sprite = droneModel.children.find(
      (child) => child instanceof THREE.Sprite
    );

    if (sprite) {
      sprite.visible = visible;
    } else if (visible) {
      // Create label if it doesn't exist but should be visible
      const drone = this.drones.find((d) => d.id === droneId);
      if (drone) {
        this.addDroneLabel(droneModel as THREE.Group, drone);
      }
    }
  }

  private updateLabels(): void {
    // Update visibility of all drone labels
    this.droneModels.forEach((model, droneId) => {
      this.updateDroneLabel(
        model,
        droneId,
        this.showLabels || droneId === this.selectedDroneId
      );
    });
  }

  private updateCameraPosition(): void {
    if (!this.matrix || this.drones.length === 0) return;

    // Calculate the center of the matrix
    const centerX = this.matrix.maxX / 2;
    const centerZ = this.matrix.maxY / 2;

    // Calculate the size of the matrix
    const size = Math.max(this.matrix.maxX, this.matrix.maxY);

    // Position camera to view the entire matrix
    this.camera.position.set(centerX + size, size, centerZ + size);
    this.camera.lookAt(centerX, 0, centerZ);

    // Update controls
    this.controls.target.set(centerX, 0, centerZ);
    this.controls.update();
  }

  private updateThreeJsScene(): void {
    // Remove existing grid
    if (this.gridHelper) {
      this.scene.remove(this.gridHelper);
    }

    // Create new grid based on matrix size
    if (this.matrix) {
      const gridSize = Math.max(this.matrix.maxX, this.matrix.maxY);
      this.gridHelper = new THREE.GridHelper(gridSize, gridSize);
      this.scene.add(this.gridHelper);

      // Update camera position
      this.updateCameraPosition();
    }

    // Recreate drone models
    this.createDroneModels();
  }

  private onWindowResize(): void {
    if (!this.container3dRef || !this.camera || !this.renderer) return;

    const container = this.container3dRef.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Update controls
    if (this.controls) {
      this.controls.update();
    }

    // Animate drone movements
    this.animateDrones();

    // Render scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  private animateDrones(): void {
    // Animate position changes
    this.droneModels.forEach((model) => {
      const userData = (model as any).userData;

      // Position animation
      if (userData && userData.startPosition && userData.targetPosition) {
        userData.animationProgress += 0.05;

        if (userData.animationProgress <= 1) {
          // Interpolate position
          const newPosition = userData.startPosition
            .clone()
            .lerp(userData.targetPosition, userData.animationProgress);

          // Add a slight up-down motion during movement
          const heightOffset =
            Math.sin(userData.animationProgress * Math.PI) * 0.5;
          newPosition.y = 0.2 + heightOffset;

          model.position.copy(newPosition);
        } else {
          // Animation complete
          model.position.copy(userData.targetPosition);
          delete userData.startPosition;
          delete userData.targetPosition;
          delete userData.animationProgress;
        }
      }

      // Propeller rotation animation
      model.children.forEach((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.geometry instanceof THREE.BoxGeometry &&
          child.geometry.parameters.width === 0.2 &&
          child.geometry.parameters.height === 0.05
        ) {
          // This is a propeller
          child.rotation.y += 0.3;
        }
      });

      // Glow effect animation for selected drone
      if (userData && userData.glowMesh) {
        userData.glowFactor += 0.03 * userData.glowDirection;

        if (userData.glowFactor >= 1) {
          userData.glowFactor = 1;
          userData.glowDirection = -1;
        } else if (userData.glowFactor <= 0.3) {
          userData.glowFactor = 0.3;
          userData.glowDirection = 1;
        }

        userData.glowMesh.material.opacity = userData.glowFactor * 0.3;
        userData.glowMesh.scale.y = 0.8 + userData.glowFactor * 0.2;
      }
    });
  }
}
