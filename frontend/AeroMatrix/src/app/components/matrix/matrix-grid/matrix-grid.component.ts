import {
  Component,
  Input,
  type OnChanges,
  type SimpleChanges,
} from '@angular/core';
import { type DroneModel, Orientation } from '../../../models/drone.model';
import type { MatrixModel } from '../../../models/matrix.model';

@Component({
  selector: 'app-matrix-grid',
  templateUrl: './matrix-grid.component.html',
  styleUrls: ['./matrix-grid.component.css'],
})
export class MatrixGridComponent implements OnChanges {
  @Input() matrix!: MatrixModel;

  grid: any[][] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['matrix'] && this.matrix) {
      this.initializeGrid();
    }
  }

  initializeGrid(): void {
    this.grid = [];

    // Create empty grid
    for (let y = 0; y < this.matrix.maxY; y++) {
      const row = [];
      for (let x = 0; x < this.matrix.maxX; x++) {
        row.push(null);
      }
      this.grid.push(row);
    }

    // Place drones on grid
    if (this.matrix.drones) {
      for (const drone of this.matrix.drones) {
        if (drone.x < this.matrix.maxX && drone.y < this.matrix.maxY) {
          this.grid[this.matrix.maxY - 1 - drone.y][drone.x] = drone;
        }
      }
    }
  }

  getOrientationIcon(orientation: Orientation): string {
    switch (orientation) {
      case Orientation.NORTH:
        return 'pi-arrow-up';
      case Orientation.EAST:
        return 'pi-arrow-right';
      case Orientation.SOUTH:
        return 'pi-arrow-down';
      case Orientation.WEST:
        return 'pi-arrow-left';
      default:
        return 'pi-arrow-up';
    }
  }

  getDroneTooltip(drone: DroneModel): string {
    return `${drone.name} (${drone.model})
Position: (${drone.x}, ${drone.y})
Orientation: ${drone.orientation}`;
  }
}
