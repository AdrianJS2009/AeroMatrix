import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { DroneMatrixComponent } from '../drones/components/drone-matrix.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    CardModule,
    DividerModule,
    DroneMatrixComponent,
  ],
  animations: [
    // Fade in animation for smooth entrance
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '800ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    // Slide in animation from left
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate(
          '800ms 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    // Slide in from right animation
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate(
          '800ms 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    // Scale in animation for zoom effect
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate(
          '600ms 500ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'scale(1)' })
        ),
      ]),
    ]),
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  // Demo matrix configuration
  demoMatrix = {
    id: 1,
    maxX: 10,
    maxY: 10,
    drones: [],
  };

  // Sample demo drones data with initial positions and orientation
  demoDrones = [
    {
      id: 1,
      name: 'Drone 1',
      model: 'Explorer',
      x: 2,
      y: 3,
      orientation: 'N',
      matrixId: 1,
    },
    {
      id: 2,
      name: 'Drone 2',
      model: 'Scout',
      x: 5,
      y: 7,
      orientation: 'E',
      matrixId: 1,
    },
    {
      id: 3,
      name: 'Drone 3',
      model: 'Voyager',
      x: 8,
      y: 2,
      orientation: 'S',
      matrixId: 1,
    },
    {
      id: 4,
      name: 'Drone 4',
      model: 'Pathfinder',
      x: 4,
      y: 5,
      orientation: 'W',
      matrixId: 1,
    },
  ];

  constructor(private readonly router: Router) {}

  ngOnInit() {
    // Start animating demo drones after component initialization
    this.animateDemoDrones();
  }

  // Navigation method to change routes
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // Simulate drone movements using different patterns and ensuring boundary constraints
  animateDemoDrones(): void {
    let step = 0;
    setInterval(() => {
      step++;

      // Create a new positions array based on current drone positions
      const newPositions = this.demoDrones.map((drone) => ({
        id: drone.id,
        x: drone.x,
        y: drone.y,
      }));

      // Drone 1: Circular pattern movement
      newPositions[0].x = 2 + Math.floor(Math.sin(step / 10) * 2);
      newPositions[0].y = 3 + Math.floor(Math.cos(step / 10) * 2);
      newPositions[0].x = Math.max(
        0,
        Math.min(newPositions[0].x, this.demoMatrix.maxX - 1)
      );
      newPositions[0].y = Math.max(
        0,
        Math.min(newPositions[0].y, this.demoMatrix.maxY - 1)
      );

      // Drone 2: Figure-8 pattern movement
      newPositions[1].x = 5 + Math.floor(Math.cos(step / 15) * 3);
      newPositions[1].y = 7 + Math.floor(Math.sin((step / 15) * 2) * 2);
      newPositions[1].x = Math.max(
        0,
        Math.min(newPositions[1].x, this.demoMatrix.maxX - 1)
      );
      newPositions[1].y = Math.max(
        0,
        Math.min(newPositions[1].y, this.demoMatrix.maxY - 1)
      );

      // Drone 3: Vertical oscillation movement
      newPositions[2].x = 8 + Math.floor(Math.sin(step / 20) * 1);
      newPositions[2].y = 2 + Math.floor(Math.cos(step / 20) * 3);
      newPositions[2].x = Math.max(
        0,
        Math.min(newPositions[2].x, this.demoMatrix.maxX - 1)
      );
      newPositions[2].y = Math.max(
        0,
        Math.min(newPositions[2].y, this.demoMatrix.maxY - 1)
      );

      // Drone 4: Diagonal movement pattern
      newPositions[3].x = 4 + Math.floor(Math.cos(step / 12) * 2);
      newPositions[3].y = 5 + Math.floor(Math.sin(step / 12) * 2);
      newPositions[3].x = Math.max(
        0,
        Math.min(newPositions[3].x, this.demoMatrix.maxX - 1)
      );
      newPositions[3].y = Math.max(
        0,
        Math.min(newPositions[3].y, this.demoMatrix.maxY - 1)
      );

      // Collision detection: adjust positions if two drones overlap
      for (let i = 0; i < newPositions.length; i++) {
        for (let j = i + 1; j < newPositions.length; j++) {
          if (
            newPositions[i].x === newPositions[j].x &&
            newPositions[i].y === newPositions[j].y
          ) {
            newPositions[j].x = (newPositions[j].x + 1) % this.demoMatrix.maxX;
            newPositions[j].y = (newPositions[j].y + 1) % this.demoMatrix.maxY;
          }
        }
      }

      // Apply the new positions to the demo drones
      this.demoDrones.forEach((drone, index) => {
        drone.x = newPositions[index].x;
        drone.y = newPositions[index].y;
      });

      // Update orientations periodically to simulate changes in drone direction
      if (step % 20 === 0) {
        const orientations = ['N', 'E', 'S', 'W'];
        this.demoDrones.forEach((drone) => {
          drone.orientation =
            orientations[Math.floor(Math.random() * orientations.length)];
        });
      }

      // Force change detection by assigning a new array reference
      this.demoDrones = [...this.demoDrones];
    }, 500);
  }
}
