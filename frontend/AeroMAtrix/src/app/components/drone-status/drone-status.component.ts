import { Component, Input, type OnInit } from '@angular/core';
import type { Drone } from '../../models/drone.model';

@Component({
  selector: 'app-drone-status',
  templateUrl: './drone-status.component.html',
  styleUrls: ['./drone-status.component.scss'],
})
export class DroneStatusComponent implements OnInit {
  @Input() drone!: Drone;

  constructor() {}

  ngOnInit(): void {}

  getOrientationIcon(): string {
    switch (this.drone.orientation) {
      case 'N':
        return 'pi pi-arrow-up';
      case 'E':
        return 'pi pi-arrow-right';
      case 'S':
        return 'pi pi-arrow-down';
      case 'W':
        return 'pi pi-arrow-left';
      default:
        return 'pi pi-circle';
    }
  }

  getOrientationText(): string {
    switch (this.drone.orientation) {
      case 'N':
        return 'North';
      case 'E':
        return 'East';
      case 'S':
        return 'South';
      case 'W':
        return 'West';
      default:
        return this.drone.orientation;
    }
  }
}
