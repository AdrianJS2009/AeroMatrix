import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  type AfterViewInit,
  Component,
  type ElementRef,
  EventEmitter,
  Input,
  NgZone,
  type OnChanges,
  type OnDestroy,
  type OnInit,
  Output,
  type SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { Matrix } from '../../../matrices/models/matrix.model';
import { Drone } from '../../models/drone.model';

// Import Three.js and OrbitControls
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
    BadgeModule,
    DividerModule,
    InputSwitchModule,
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
  templateUrl: './drone-matrix.component.html',
  styleUrls: ['./drone-matrix.component.scss'],
})
export class DroneMatrixComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() matrix?: Matrix;
  @Input() drones: Drone[] = [];
  @Input() selectedDroneId?: number;
  @Input() isInteractive = true;
  @Output() droneSelected = new EventEmitter<Drone>();

  @ViewChild('viewport') viewportRef!: ElementRef;
  @ViewChild('container3d') container3dRef!: ElementRef;

  // 2D view properties
  cellSize = 80; // Size of each cell in pixels
  scale = 1; // Current zoom level for 2D view
  panX = 0; // Current pan X position
  panY = 0; // Current pan Y position
  isPanning = false; // Whether user is panning
  startPanX = 0; // Start X for pan gesture
  startPanY = 0; // Start Y for pan gesture
  lastPanX = 0; // Last recorded pan X
  lastPanY = 0; // Last recorded pan Y
  view3D = false; // Flag to toggle 2D/3D view
  showLabels = true; // Whether to show coordinate labels in 2D view
  enhancedGrid = true; // Whether enhanced grid styling is active
  showCoordinates = false; // Whether to show mouse coordinates overlay
  currentCoordinates = '(0, 0)'; // Current coordinates under mouse in grid
  showHelp = false; // Whether to show help overlay
  recentlyPanned = false; // Track if user recently panned the view
  panTimeout?: any; // Timeout for tracking recent panning

  // Three.js properties
  private scene!: THREE.Scene;
  private readonly clock: THREE.Clock = new THREE.Clock();
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private readonly droneModels: Map<number, THREE.Object3D> = new Map();
  private gridHelper!: THREE.GridHelper;
  private animationFrameId?: number;

  constructor(private readonly ngZone: NgZone) {}

  ngOnInit(): void {
    // For 2D view, reset and center the matrix
    this.resetView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['matrix'] && this.matrix) {
      // Reset view when matrix changes
      this.resetView();

      // Update 3D scene if active
      if (this.view3D && this.scene) {
        this.updateThreeJsScene();
      }
    }

    if (changes['drones'] && this.drones.length > 0) {
      // When drones change, fit all drones in view
      setTimeout(() => this.fitAllDrones(), 100);

      if (this.view3D && this.scene) {
        this.updateDronePositions();
      }
    }

    if (changes['selectedDroneId'] && this.view3D && this.scene) {
      this.updateSelectedDrone();
    }
  }

  ngAfterViewInit(): void {
    if (this.view3D) {
      this.initThreeJs();
    }

    // Initial fit all drones
    setTimeout(() => this.fitAllDrones(), 300);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.panTimeout) {
      clearTimeout(this.panTimeout);
    }
  }

  // Utility: Create an array of numbers from 0 to size - 1
  getArrayFromSize(size: number): number[] {
    return Array.from({ length: size }, (_, i) => i);
  }

  // Emit the selected drone
  selectDrone(drone: Drone): void {
    if (this.isInteractive) {
      this.droneSelected.emit(drone);
    }
  }

  // Clear drone selection
  clearSelection(): void {
    this.droneSelected.emit({} as Drone);
  }

  // Return the name of the selected drone
  getSelectedDroneName(): string {
    const drone = this.drones.find((d) => d.id === this.selectedDroneId);
    return drone ? drone.name : '';
  }

  // Return a label string for drone orientation
  getOrientationLabel(orientation: string): string {
    const orientations: Record<string, string> = {
      N: 'North',
      S: 'South',
      E: 'East',
      W: 'West',
      O: 'West',
    };
    return orientations[orientation] || orientation;
  }

  // 2D View: Zoom In
  zoomIn(): void {
    if (this.view3D) {
      if (this.controls) {
        this.controls.dollyIn(1.2);
        this.controls.update();
      }
    } else {
      this.scale = Math.min(this.scale * 1.2, 3);
    }
  }

  // 2D View: Zoom Out
  zoomOut(): void {
    if (this.view3D) {
      if (this.controls) {
        this.controls.dollyOut(1.2);
        this.controls.update();
      }
    } else {
      this.scale = Math.max(this.scale / 1.2, 0.3);
    }
  }

  // Reset view for 2D or 3D
  resetView(): void {
    if (this.view3D) {
      if (this.controls) {
        this.controls.reset();
      }
    } else {
      this.scale = 1;
      this.panX = 0;
      this.panY = 0;
      this.lastPanX = 0;
      this.lastPanY = 0;
      if (this.matrix) {
        setTimeout(() => this.centerMatrix(), 0);
      }
    }
  }

  // Center the matrix in the 2D viewport
  centerMatrix(): void {
    if (!this.viewportRef || !this.matrix) return;
    const viewport = this.viewportRef.nativeElement;
    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;
    const matrixWidth = this.matrix.maxX * this.cellSize;
    const matrixHeight = this.matrix.maxY * this.cellSize;
    this.panX = (viewportWidth - matrixWidth) / 2 / this.scale;
    this.panY = (viewportHeight - matrixHeight) / 2 / this.scale;
    this.lastPanX = this.panX;
    this.lastPanY = this.panY;
  }

  // Fit all drones in the viewport
  fitAllDrones(): void {
    if (!this.viewportRef || !this.matrix || this.drones.length === 0) {
      this.centerMatrix();
      return;
    }

    // Find the bounding box of all drones
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;

    this.drones.forEach((drone) => {
      minX = Math.min(minX, drone.x);
      minY = Math.min(minY, drone.y);
      maxX = Math.max(maxX, drone.x);
      maxY = Math.max(maxY, drone.y);
    });

    // Add padding
    minX = Math.max(0, minX - 1);
    minY = Math.max(0, minY - 1);
    maxX = Math.min(this.matrix.maxX - 1, maxX + 1);
    maxY = Math.min(this.matrix.maxY - 1, maxY + 1);

    // Calculate the center of the bounding box
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Calculate the size of the bounding box
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    // Calculate the scale needed to fit the bounding box
    const viewport = this.viewportRef.nativeElement;
    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;

    const scaleX = viewportWidth / (width * this.cellSize);
    const scaleY = viewportHeight / (height * this.cellSize);

    // Use the smaller scale to ensure everything fits
    this.scale = Math.min(scaleX, scaleY) * 0.8; // 80% to add some margin
    this.scale = Math.min(Math.max(this.scale, 0.3), 3); // Clamp scale between 0.3 and 3

    // Calculate the pan position to center the bounding box
    const matrixCenterX = centerX * this.cellSize;
    const matrixCenterY = (this.matrix.maxY - 1 - centerY) * this.cellSize;

    this.panX = (viewportWidth / 2 - matrixCenterX * this.scale) / this.scale;
    this.panY = (viewportHeight / 2 - matrixCenterY * this.scale) / this.scale;

    this.lastPanX = this.panX;
    this.lastPanY = this.panY;
  }

  // Fit all drones in 3D view
  fit3DAllDrones(): void {
    if (!this.matrix || this.drones.length === 0 || !this.controls) return;

    // Find the bounding box of all drones
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;

    this.drones.forEach((drone) => {
      minX = Math.min(minX, drone.x);
      minY = Math.min(minY, drone.y);
      maxX = Math.max(maxX, drone.x);
      maxY = Math.max(maxY, drone.y);
    });

    // Add padding
    minX = Math.max(0, minX - 1);
    minY = Math.max(0, minY - 1);
    maxX = Math.min(this.matrix.maxX - 1, maxX + 1);
    maxY = Math.min(this.matrix.maxY - 1, maxY + 1);

    // Calculate the center of the bounding box
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Set the camera position to look at the center
    this.controls.target.set(centerX, 0, centerY);

    // Calculate the size of the bounding box
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    const size = Math.max(width, height);

    // Position the camera to see all drones
    const distance = size * 1.5;
    this.camera.position.set(centerX + distance, distance, centerY + distance);

    this.controls.update();
  }

  // Mouse down event to start panning in 2D view
  startPan(event: MouseEvent): void {
    this.isPanning = true;
    this.startPanX = event.clientX;
    this.startPanY = event.clientY;
    this.trackRecentPan();
  }

  // Mouse move event to pan the 2D grid
  pan(event: MouseEvent): void {
    if (!this.isPanning) return;
    const deltaX = event.clientX - this.startPanX;
    const deltaY = event.clientY - this.startPanY;
    this.panX = this.lastPanX + deltaX / this.scale;
    this.panY = this.lastPanY + deltaY / this.scale;
    this.updateMouseCoordinates(event);
    this.trackRecentPan();
  }

  // End panning when mouse is up or leaves the viewport
  endPan(): void {
    if (this.isPanning) {
      this.isPanning = false;
      this.lastPanX = this.panX;
      this.lastPanY = this.panY;
    }
  }

  // Track when user recently panned
  trackRecentPan(): void {
    this.recentlyPanned = true;
    if (this.panTimeout) {
      clearTimeout(this.panTimeout);
    }
    this.panTimeout = setTimeout(() => {
      this.recentlyPanned = false;
    }, 3000); // Reset after 3 seconds
  }

  // Update current grid coordinates based on mouse position
  updateMouseCoordinates(event: MouseEvent): void {
    if (!this.matrix || !this.viewportRef) return;
    const viewport = this.viewportRef.nativeElement;
    const rect = viewport.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / this.scale - this.panX;
    const mouseY = (event.clientY - rect.top) / this.scale - this.panY;
    const gridX = Math.floor(mouseX / this.cellSize);
    const gridY = this.matrix.maxY - 1 - Math.floor(mouseY / this.cellSize);
    if (
      gridX >= 0 &&
      gridX < this.matrix.maxX &&
      gridY >= 0 &&
      gridY < this.matrix.maxY
    ) {
      this.currentCoordinates = `(${gridX}, ${gridY})`;
      this.showCoordinates = true;
    } else {
      this.showCoordinates = false;
    }
  }

  // Handle wheel event inside the component
  onWheelInside(event: WheelEvent): void {
    event.preventDefault();
    const rect = this.viewportRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const oldScale = this.scale;
    if (event.deltaY < 0) {
      this.scale = Math.min(this.scale * 1.1, 3);
    } else {
      this.scale = Math.max(this.scale / 1.1, 0.3);
    }
    const panAdjustX = mouseX / oldScale - mouseX / this.scale;
    const panAdjustY = mouseY / oldScale - mouseY / this.scale;
    this.panX = this.lastPanX + panAdjustX;
    this.panY = this.lastPanY + panAdjustY;
    this.lastPanX = this.panX;
    this.lastPanY = this.panY;
    this.trackRecentPan();
  }

  // Handle keyboard navigation
  handleKeyboardNavigation(event: KeyboardEvent): void {
    const panStep = 20 / this.scale;

    switch (event.key) {
      case 'ArrowUp':
        this.panY += panStep;
        break;
      case 'ArrowDown':
        this.panY -= panStep;
        break;
      case 'ArrowLeft':
        this.panX += panStep;
        break;
      case 'ArrowRight':
        this.panX -= panStep;
        break;
      case '+':
        this.zoomIn();
        break;
      case '-':
        this.zoomOut();
        break;
      case 'Home':
        this.fitAllDrones();
        break;
      case 'Escape':
        this.clearSelection();
        break;
      default:
        return;
    }

    event.preventDefault();
    this.lastPanX = this.panX;
    this.lastPanY = this.panY;
    this.trackRecentPan();
  }

  // Toggle help overlay
  toggleHelp(): void {
    this.showHelp = !this.showHelp;
  }

  // Hide help overlay
  hideHelp(): void {
    this.showHelp = false;
  }

  // Get mini-map viewport position and size
  getMiniMapViewportLeft(): number {
    if (!this.matrix || !this.viewportRef) return 0;

    const matrixWidth = this.matrix.maxX * this.cellSize * this.scale;

    // Calculate visible portion of the matrix
    const visibleLeft = -this.panX * this.scale;
    const percentLeft = (visibleLeft / matrixWidth) * 100;

    return Math.max(0, Math.min(100, percentLeft));
  }

  getMiniMapViewportTop(): number {
    if (!this.matrix || !this.viewportRef) return 0;

    const matrixHeight = this.matrix.maxY * this.cellSize * this.scale;

    // Calculate visible portion of the matrix
    const visibleTop = -this.panY * this.scale;
    const percentTop = (visibleTop / matrixHeight) * 100;

    return Math.max(0, Math.min(100, percentTop));
  }

  getMiniMapViewportWidth(): number {
    if (!this.matrix || !this.viewportRef) return 100;

    const viewport = this.viewportRef.nativeElement;
    const viewportWidth = viewport.clientWidth;
    const matrixWidth = this.matrix.maxX * this.cellSize * this.scale;

    // Calculate percentage of matrix visible
    const percentWidth = (viewportWidth / matrixWidth) * 100;

    return Math.min(100, percentWidth);
  }

  getMiniMapViewportHeight(): number {
    if (!this.matrix || !this.viewportRef) return 100;

    const viewport = this.viewportRef.nativeElement;
    const viewportHeight = viewport.clientHeight;
    const matrixHeight = this.matrix.maxY * this.cellSize * this.scale;

    // Calculate percentage of matrix visible
    const percentHeight = (viewportHeight / matrixHeight) * 100;

    return Math.min(100, percentHeight);
  }

  // Toggle between 2D and 3D views
  toggleView(): void {
    this.view3D = !this.view3D;
    if (this.view3D) {
      setTimeout(() => this.initThreeJs(), 0);
    } else {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      if (this.renderer) {
        this.renderer.dispose();
      }
      setTimeout(() => {
        this.resetView();
        this.fitAllDrones();
      }, 0);
    }
  }

  // Update the grid style based on the current settings
  updateGridStyle(): void {
    if (this.gridHelper) {
      this.gridHelper.visible = this.enhancedGrid;
    }
  }

  // === Three.js Methods ===

  // Initialize Three.js scene and components
  private initThreeJs(): void {
    if (!this.container3dRef) return;
    const container = this.container3dRef.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8f9fa);

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);

    this.createSceneContent();

    window.addEventListener('resize', () => this.onWindowResize());
    this.ngZone.runOutsideAngular(() => this.animate());

    // Fit all drones in 3D view
    setTimeout(() => this.fit3DAllDrones(), 300);
  }

  // Create scene
  private createSceneContent(): void {
    if (!this.matrix) return;

    const gridSize = Math.max(this.matrix.maxX, this.matrix.maxY);
    this.gridHelper = new THREE.GridHelper(gridSize, gridSize);
    this.scene.add(this.gridHelper);

    const planeGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xf0f0f0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = -0.01;
    this.scene.add(plane);

    const axesHelper = new THREE.AxesHelper(gridSize / 2);
    this.scene.add(axesHelper);

    this.createDroneModels();
    this.updateCameraPosition();
  }

  // Create drone models and add them to the scene
  private createDroneModels(): void {
    this.droneModels.forEach((model) => {
      this.scene.remove(model);
    });
    this.droneModels.clear();

    this.drones.forEach((drone) => {
      const droneGroup = new THREE.Group();

      // Drone body
      const bodyGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.6);
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: drone.id === this.selectedDroneId ? 0x0059a6 : 0x0d8de3,
        shininess: 100,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      droneGroup.add(body);

      // Propellers
      const propellerGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.05);
      const propellerMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
      });

      const propeller1 = new THREE.Mesh(propellerGeometry, propellerMaterial);
      propeller1.position.set(-0.25, 0.1, -0.25);
      droneGroup.add(propeller1);

      const propeller2 = new THREE.Mesh(propellerGeometry, propellerMaterial);
      propeller2.position.set(0.25, 0.1, -0.25);
      propeller2.rotation.y = Math.PI / 2;
      droneGroup.add(propeller2);

      const propeller3 = new THREE.Mesh(propellerGeometry, propellerMaterial);
      propeller3.position.set(-0.25, 0.1, 0.25);
      propeller3.rotation.y = Math.PI / 2;
      droneGroup.add(propeller3);

      const propeller4 = new THREE.Mesh(propellerGeometry, propellerMaterial);
      propeller4.position.set(0.25, 0.1, 0.25);
      droneGroup.add(propeller4);

      // Direction indicator
      const directionGeometry = new THREE.ConeGeometry(0.15, 0.3, 8);
      const directionMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
      });
      const directionIndicator = new THREE.Mesh(
        directionGeometry,
        directionMaterial
      );

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
          directionIndicator.position.set(-0.4, 0.1, 0);
          directionIndicator.rotation.z = -Math.PI / 2;
          break;
      }
      droneGroup.add(directionIndicator);

      // Add label if needed
      if (this.showLabels || drone.id === this.selectedDroneId) {
        this.addDroneLabel(droneGroup, drone);
      }

      droneGroup.position.set(drone.x, 0.2, drone.y);
      this.scene.add(droneGroup);
      this.droneModels.set(drone.id, droneGroup);

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
        (droneGroup as any).userData = {
          glowMesh,
          glowFactor: 0,
          glowDirection: 1,
        };
      }
    });

    this.updateCameraPosition();
  }

  // Create a canvas label for a drone and add it as a sprite to the group
  private addDroneLabel(droneGroup: THREE.Group, drone: Drone): void {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.width = 256;
    canvas.height = 128;

    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = 'bold 24px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(drone.name, canvas.width / 2, 40);
    context.font = '20px Arial';
    context.fillText(`(${drone.x}, ${drone.y})`, canvas.width / 2, 80);

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

  // Update positions of drones in Three.js scene based on current data
  private updateDronePositions(): void {
    this.drones.forEach((drone) => {
      const droneModel = this.droneModels.get(drone.id);
      if (droneModel) {
        const boundedX = Math.max(0, Math.min(drone.x, this.matrix?.maxX ?? 9));
        const boundedY = Math.max(0, Math.min(drone.y, this.matrix?.maxY ?? 9));
        if (boundedX !== drone.x || boundedY !== drone.y) {
          drone.x = boundedX;
          drone.y = boundedY;
        }
        const targetPosition = new THREE.Vector3(boundedX, 0.2, boundedY);
        const currentPosition = droneModel.position.clone();
        const distance = currentPosition.distanceTo(targetPosition);
        if (distance > 0.01) {
          (droneModel as any).userData = {
            ...(droneModel as any).userData,
            startPosition: currentPosition,
            targetPosition,
            animationProgress: 0,
          };
        } else {
          droneModel.position.copy(targetPosition);
        }
        this.updateDroneOrientation(droneModel, drone.orientation);
      } else {
        this.createDroneModels();
      }
    });
  }

  // Update orientation of the drone model based on the given orientation
  private updateDroneOrientation(
    droneModel: THREE.Object3D,
    orientation: string
  ): void {
    const directionIndicator = droneModel.children.find(
      (child) =>
        child instanceof THREE.Mesh &&
        (child.geometry as THREE.BufferGeometry).type === 'ConeGeometry'
    );
    if (directionIndicator) {
      directionIndicator.rotation.set(0, 0, 0);
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
          directionIndicator.position.set(-0.4, 0.1, 0);
          directionIndicator.rotation.z = -Math.PI / 2;
          break;
      }
    }
  }

  // Update style of drone models based on selection state
  private updateSelectedDrone(): void {
    this.droneModels.forEach((model, droneId) => {
      const body = model.children.find(
        (child) =>
          child instanceof THREE.Mesh &&
          (child.geometry as THREE.BufferGeometry).type === 'BoxGeometry'
      );
      if (body && body instanceof THREE.Mesh) {
        const material = body.material as THREE.MeshPhongMaterial;
        if (droneId === this.selectedDroneId) {
          material.color.set(0x0059a6);
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
            (model as any).userData = {
              ...(model as any).userData,
              glowMesh,
              glowFactor: 0,
              glowDirection: 1,
            };
          }
          this.updateDroneLabel(model, droneId, true);
        } else {
          material.color.set(0x0d8de3);
          const glowMesh = model.children.find(
            (child) =>
              child instanceof THREE.Mesh &&
              child.material instanceof THREE.MeshBasicMaterial &&
              child.material.transparent
          );
          if (glowMesh) {
            model.remove(glowMesh);
          }
          this.updateDroneLabel(model, droneId, this.showLabels);
        }
      }
    });
  }

  // Update (or create) drone label visibility
  private updateDroneLabel(
    droneModel: THREE.Object3D,
    droneId: number,
    visible: boolean
  ): void {
    const sprite = droneModel.children.find(
      (child) => child instanceof THREE.Sprite
    );
    if (sprite) {
      sprite.visible = visible;
    } else if (visible) {
      const drone = this.drones.find((d) => d.id === droneId);
      if (drone) {
        this.addDroneLabel(droneModel as THREE.Group, drone);
      }
    }
  }

  // Update camera position to frame the matrix and drones
  private updateCameraPosition(): void {
    if (!this.matrix || this.drones.length === 0) return;
    const centerX = this.matrix.maxX / 2;
    const centerZ = this.matrix.maxY / 2;
    const size = Math.max(this.matrix.maxX, this.matrix.maxY);
    this.camera.position.set(centerX + size, size, centerZ + size);
    this.camera.lookAt(centerX, 0, centerZ);
    this.controls.target.set(centerX, 0, centerZ);
    this.controls.update();
  }

  // Update the scene when the matrix or drones change
  private updateThreeJsScene(): void {
    if (this.gridHelper) {
      this.scene.remove(this.gridHelper);
    }
    if (this.matrix) {
      const gridSize = Math.max(this.matrix.maxX, this.matrix.maxY);
      this.gridHelper = new THREE.GridHelper(gridSize, gridSize);
      this.scene.add(this.gridHelper);
      this.updateCameraPosition();
    }
    this.createDroneModels();
  }

  // Handle window resize for the 3D view
  private onWindowResize(): void {
    if (!this.container3dRef || !this.camera || !this.renderer) return;
    const container = this.container3dRef.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // Animation loop
  private animate(): void {
    const delta = this.clock.getDelta();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    if (this.controls) {
      this.controls.update();
    }
    // Example of drone animations using delta time
    this.droneModels.forEach((model) => {
      const userData = (model as any).userData;
      if (userData?.startPosition && userData?.targetPosition) {
        userData.animationProgress += delta;
        if (userData.animationProgress <= 1) {
          const newPosition = userData.startPosition
            .clone()
            .lerp(userData.targetPosition, userData.animationProgress);
          const heightOffset =
            Math.sin(userData.animationProgress * Math.PI) * 0.5;
          newPosition.y = 0.2 + heightOffset;
          model.position.copy(newPosition);
        } else {
          model.position.copy(userData.targetPosition);
          delete userData.startPosition;
          delete userData.targetPosition;
          delete userData.animationProgress;
        }
      }
    });
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Additional drone animation method
  private animateDrones(): void {
    this.droneModels.forEach((model) => {
      const userData = (model as any).userData;
      if (userData?.startPosition && userData?.targetPosition) {
        userData.animationProgress += 0.05;
        if (userData.animationProgress <= 1) {
          const newPosition = userData.startPosition
            .clone()
            .lerp(userData.targetPosition, userData.animationProgress);
          const heightOffset =
            Math.sin(userData.animationProgress * Math.PI) * 0.5;
          newPosition.y = 0.2 + heightOffset;
          model.position.copy(newPosition);
        } else {
          model.position.copy(userData.targetPosition);
          delete userData.startPosition;
          delete userData.targetPosition;
          delete userData.animationProgress;
        }
      }
      model.children.forEach((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.geometry instanceof THREE.BoxGeometry &&
          child.geometry.parameters.width === 0.2 &&
          child.geometry.parameters.height === 0.05
        ) {
          child.rotation.y += 0.3;
        }
      });
      if (userData?.glowMesh) {
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
