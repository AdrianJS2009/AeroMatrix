import {
  Component,
  Input,
  type OnChanges,
  type SimpleChanges,
} from '@angular/core';
import type { Drone } from '../../models/drone.model';
import type { Matrix } from '../../models/matrix.model';

@Component({
  selector: 'app-matrix-visual',
  templateUrl: './matrix-visual.component.html',
  styleUrls: ['./matrix-visual.component.scss'],
})
export class MatrixVisualComponent implements OnChanges {
  @Input() matrix!: Matrix;

  gridCells: any[][] = [];
  cellSize = 40;
  maxDisplaySize = 10; // Maximum cells to display before scaling

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['matrix'] && this.matrix) {
      this.generateGrid();
    }
  }

  generateGrid(): void {
    // Calculate cell size based on matrix dimensions
    if (
      this.matrix.maxX > this.maxDisplaySize ||
      this.matrix.maxY > this.maxDisplaySize
    ) {
      this.cellSize = Math.min(
        Math.floor(400 / this.matrix.maxX),
        Math.floor(400 / this.matrix.maxY)
      );
    } else {
      this.cellSize = 40;
    }

    // Generate grid cells
    this.gridCells = [];
    for (let y = this.matrix.maxY - 1; y >= 0; y--) {
      const row = [];
      for (let x = 0; x < this.matrix.maxX; x++) {
        const drone = this.findDroneAtPosition(x, y);
        row.push({
          x,
          y,
          drone,
        });
      }
      this.gridCells.push(row);
    }
  }

  findDroneAtPosition(x: number, y: number): Drone | null {
    if (!this.matrix.drones) return null;
    return (
      this.matrix.drones.find((drone) => drone.x === x && drone.y === y) || null
    );
  }

  getOrientationArrow(orientation: string): string {
    switch (orientation) {
      case 'N':
        return '↑';
      case 'E':
        return '→';
      case 'S':
        return '↓';
      case 'W':
        return '←';
      default:
        return '•';
    }
  }
}
