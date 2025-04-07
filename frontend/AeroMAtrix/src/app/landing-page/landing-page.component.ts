import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
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
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '800ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate(
          '800ms 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate(
          '800ms 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
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
  template: `
    <div class="landing-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-text" @fadeIn>
            <h1 class="gradient-text">Advanced Drone Control System</h1>
            <p>
              Precision flight management with interactive 3D matrix
              visualization
            </p>
            <div class="hero-buttons">
              <button
                pButton
                pRipple
                label="Get Started"
                icon="pi pi-arrow-right"
                class="p-button-lg"
                (click)="navigateTo('/drones')"
              ></button>
              <button
                pButton
                pRipple
                label="Explore Features"
                icon="pi pi-info-circle"
                class="p-button-outlined p-button-lg"
              ></button>
            </div>
          </div>

          <div class="hero-matrix glass-effect" @slideInRight>
            <div class="matrix-demo">
              <!-- Demo Matrix -->
              <app-drone-matrix
                [matrix]="demoMatrix"
                [drones]="demoDrones"
                [selectedDroneId]="1"
              ></app-drone-matrix>
            </div>
          </div>
        </div>

        <div class="hero-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="section-header" @fadeIn>
          <h2>Immersive 3D Visualization</h2>
          <p>
            Experience drone control like never before with our interactive 3D
            matrix
          </p>
        </div>

        <div class="features-grid">
          <div class="feature-card" @slideIn>
            <div class="feature-icon">
              <i class="pi pi-cube"></i>
            </div>
            <h3>Interactive 3D View</h3>
            <p>
              Switch between 2D and 3D perspectives with realistic drone models
              and animations
            </p>
          </div>

          <div class="feature-card" @slideIn>
            <div class="feature-icon">
              <i class="pi pi-arrows-alt"></i>
            </div>
            <h3>Advanced Controls</h3>
            <p>
              Rotate, pan, and zoom with intuitive controls for complete spatial
              awareness
            </p>
          </div>

          <div class="feature-card" @slideIn>
            <div class="feature-icon">
              <i class="pi pi-sync"></i>
            </div>
            <h3>Real-time Updates</h3>
            <p>
              Watch drones move in real-time with smooth animations as commands
              are executed
            </p>
          </div>

          <div class="feature-card" @slideIn>
            <div class="feature-icon">
              <i class="pi pi-sliders-h"></i>
            </div>
            <h3>Customizable Display</h3>
            <p>
              Adjust visualization settings to match your operational
              requirements
            </p>
          </div>
        </div>
      </section>

      <section class="cta-section" @fadeIn>
        <div class="cta-content">
          <h2>Ready to take control?</h2>
          <p>
            Start managing your drone fleet with precision and efficiency today
          </p>
          <button
            pButton
            pRipple
            label="Launch Control Center"
            icon="pi pi-arrow-right"
            class="p-button-lg"
            (click)="navigateTo('/flights')"
          ></button>
        </div>

        <div class="cta-shapes">
          <div class="shape shape-4"></div>
          <div class="shape shape-5"></div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="footer-content">
          <div class="footer-logo">
            <i class="pi pi-send"></i>
            <span class="gradient-text">AeroMatrix</span>
          </div>
          <div class="footer-links">
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          <div class="footer-social">
            <a href="https://github.com/AdrianJS2009"
              ><i class="pi pi-github"></i
            ></a>

            <a href="#"><i class="pi pi-linkedin"></i></a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 AeroMatrix Control System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .landing-container {
        min-height: 100vh;
        overflow-x: hidden;
      }

      /* Hero  */
      .hero-section {
        background: linear-gradient(
          135deg,
          var(--primary-900) 0%,
          var(--primary-800) 100%
        );
        color: white;
        padding: 6rem 2rem;
        position: relative;
        overflow: hidden;
      }

      .hero-content {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 3rem;
        position: relative;
        z-index: 10;
      }

      .hero-text {
        flex: 1;
        max-width: 600px;
      }

      .hero-text h1 {
        font-size: 4rem;
        font-weight: 800;
        margin-bottom: 1.5rem;
        line-height: 1.1;
        letter-spacing: -0.03em;
      }

      .hero-text p {
        font-size: 1.35rem;
        margin-bottom: 2.5rem;
        opacity: 0.9;
        line-height: 1.6;
      }

      .hero-buttons {
        display: flex;
        gap: 1rem;
      }

      .hero-matrix {
        flex: 1;
        max-width: 700px;
        height: 500px;
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .matrix-demo {
        height: 100%;
      }

      .hero-shapes {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 1;
      }

      .shape {
        position: absolute;
        border-radius: 50%;
        opacity: 0.1;
      }

      .shape-1 {
        width: 400px;
        height: 400px;
        background: var(--primary-300);
        top: -100px;
        right: -100px;
        animation: float 15s ease-in-out infinite;
      }

      .shape-2 {
        width: 300px;
        height: 300px;
        background: var(--secondary-400);
        bottom: -50px;
        left: 10%;
        animation: float 20s ease-in-out infinite reverse;
      }

      .shape-3 {
        width: 200px;
        height: 200px;
        background: var(--primary-500);
        top: 20%;
        left: 20%;
        animation: float 25s ease-in-out infinite;
      }

      /* Features */
      .features-section {
        background-color: var(--surface-ground);
        padding: 6rem 2rem;
      }

      .section-header {
        text-align: center;
        max-width: 800px;
        margin: 0 auto 5rem;
      }

      .section-header h2 {
        font-size: 3rem;
        color: var(--text-color);
        margin-bottom: 1.25rem;
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      .section-header p {
        font-size: 1.25rem;
        color: var(--text-color-secondary);
        line-height: 1.6;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2.5rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .feature-card {
        background-color: var(--surface-card);
        border-radius: 24px;
        padding: 2.5rem;
        box-shadow: var(--shadow-md);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .feature-card:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-lg);
      }

      .feature-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        background: linear-gradient(
          135deg,
          var(--primary-100) 0%,
          var(--primary-200) 100%
        );
        border-radius: 20px;
        margin-bottom: 2rem;
      }

      .feature-icon i {
        font-size: 2.25rem;
        color: var(--primary-600);
      }

      .feature-card h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: var(--text-color);
        font-weight: 600;
      }

      .feature-card p {
        color: var(--text-color-secondary);
        line-height: 1.6;
        margin-top: auto;
      }

      /* CTA  */
      .cta-section {
        background: linear-gradient(
          135deg,
          var(--primary-700) 0%,
          var(--primary-900) 100%
        );
        color: white;
        padding: 6rem 2rem;
        text-align: center;
        position: relative;
        overflow: hidden;
      }

      .cta-content {
        max-width: 800px;
        margin: 0 auto;
        position: relative;
        z-index: 10;
      }

      .cta-content h2 {
        font-size: 3rem;
        margin-bottom: 1.25rem;
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      .cta-content p {
        font-size: 1.25rem;
        margin-bottom: 2.5rem;
        opacity: 0.9;
        line-height: 1.6;
      }

      .cta-shapes {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .shape-4 {
        width: 500px;
        height: 500px;
        background: var(--primary-600);
        opacity: 0.1;
        border-radius: 50%;
        position: absolute;
        top: -250px;
        left: -100px;
        animation: float 20s ease-in-out infinite;
      }

      .shape-5 {
        width: 300px;
        height: 300px;
        background: var(--secondary-500);
        opacity: 0.1;
        border-radius: 50%;
        position: absolute;
        bottom: -150px;
        right: 10%;
        animation: float 15s ease-in-out infinite reverse;
      }

      /* Footer */
      .landing-footer {
        background-color: var(--surface-900);
        color: white;
        padding: 4rem 2rem 1.5rem;
      }

      .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 3rem;
        margin-bottom: 3rem;
      }

      .footer-logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1.75rem;
        font-weight: 700;
      }

      .footer-links ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
      }

      .footer-links a {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        transition: color 0.2s ease;
        font-size: 1.1rem;
      }

      .footer-links a:hover {
        color: white;
      }

      .footer-social {
        display: flex;
        gap: 1.25rem;
      }

      .footer-social a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        transition: all 0.2s ease;
      }

      .footer-social a:hover {
        background-color: var(--primary-500);
        transform: translateY(-3px);
      }

      .footer-bottom {
        text-align: center;
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.6);
      }

      @keyframes float {
        0% {
          transform: translate(0, 0) rotate(0deg);
        }
        50% {
          transform: translate(20px, 20px) rotate(5deg);
        }
        100% {
          transform: translate(0, 0) rotate(0deg);
        }
      }

      /* Responsive  */
      @media screen and (max-width: 1200px) {
        .hero-content {
          flex-direction: column;
        }

        .hero-text {
          max-width: 100%;
          text-align: center;
        }

        .hero-buttons {
          justify-content: center;
        }

        .hero-matrix {
          max-width: 100%;
        }

        .hero-text h1 {
          font-size: 3.25rem;
        }
      }

      @media screen and (max-width: 768px) {
        .hero-section,
        .features-section,
        .cta-section {
          padding: 4rem 1.5rem;
        }

        .hero-text h1 {
          font-size: 2.5rem;
        }

        .hero-text p {
          font-size: 1.1rem;
        }

        .section-header h2,
        .cta-content h2 {
          font-size: 2.25rem;
        }

        .footer-content {
          flex-direction: column;
          gap: 2rem;
        }

        .footer-links ul {
          flex-direction: column;
          gap: 1rem;
        }

        .feature-card {
          padding: 2rem;
        }

        .feature-icon {
          width: 70px;
          height: 70px;
        }
      }
    `,
  ],
})
export class LandingPageComponent implements OnInit {
  demoMatrix = {
    id: 1,
    maxX: 10,
    maxY: 10,
    drones: [],
  };

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
    // Animate demo drones
    this.animateDemoDrones();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  animateDemoDrones() {
    // Simulate drone movement for the demo
    let step = 0;

    setInterval(() => {
      step++;

      // check for collisions
      const newPositions = this.demoDrones.map((drone) => ({
        id: drone.id,
        x: drone.x,
        y: drone.y,
      }));

      // Move drones in different patterns with boundary checks
      // Drone 1: Circular pattern
      newPositions[0].x = 2 + Math.floor(Math.sin(step / 10) * 2);
      newPositions[0].y = 3 + Math.floor(Math.cos(step / 10) * 2);

      // Ensure within boundaries
      newPositions[0].x = Math.max(
        0,
        Math.min(newPositions[0].x, this.demoMatrix.maxX - 1)
      );
      newPositions[0].y = Math.max(
        0,
        Math.min(newPositions[0].y, this.demoMatrix.maxY - 1)
      );

      // Drone 2: Figure-8 pattern
      newPositions[1].x = 5 + Math.floor(Math.cos(step / 15) * 3);
      newPositions[1].y = 7 + Math.floor(Math.sin((step / 15) * 2) * 2);

      // Ensure within boundaries
      newPositions[1].x = Math.max(
        0,
        Math.min(newPositions[1].x, this.demoMatrix.maxX - 1)
      );
      newPositions[1].y = Math.max(
        0,
        Math.min(newPositions[1].y, this.demoMatrix.maxY - 1)
      );

      // Drone 3: Vertical oscillation
      newPositions[2].x = 8 + Math.floor(Math.sin(step / 20) * 1);
      newPositions[2].y = 2 + Math.floor(Math.cos(step / 20) * 3);

      // Ensure within boundaries
      newPositions[2].x = Math.max(
        0,
        Math.min(newPositions[2].x, this.demoMatrix.maxX - 1)
      );
      newPositions[2].y = Math.max(
        0,
        Math.min(newPositions[2].y, this.demoMatrix.maxY - 1)
      );

      // Drone 4: Diagonal pattern
      newPositions[3].x = 4 + Math.floor(Math.cos(step / 12) * 2);
      newPositions[3].y = 5 + Math.floor(Math.sin(step / 12) * 2);

      // Ensure within boundaries
      newPositions[3].x = Math.max(
        0,
        Math.min(newPositions[3].x, this.demoMatrix.maxX - 1)
      );
      newPositions[3].y = Math.max(
        0,
        Math.min(newPositions[3].y, this.demoMatrix.maxY - 1)
      );

      // Check for collisions and adjust positions if needed
      for (let i = 0; i < newPositions.length; i++) {
        for (let j = i + 1; j < newPositions.length; j++) {
          if (
            newPositions[i].x === newPositions[j].x &&
            newPositions[i].y === newPositions[j].y
          ) {
            // Collision detected, adjust position of the second drone
            newPositions[j].x = (newPositions[j].x + 1) % this.demoMatrix.maxX;
            newPositions[j].y = (newPositions[j].y + 1) % this.demoMatrix.maxY;
          }
        }
      }

      // Apply new positions
      this.demoDrones.forEach((drone, index) => {
        drone.x = newPositions[index].x;
        drone.y = newPositions[index].y;
      });

      // Update orientations occasionally
      if (step % 20 === 0) {
        const orientations = ['N', 'E', 'S', 'W'];
        this.demoDrones.forEach((drone) => {
          drone.orientation = orientations[Math.floor(Math.random() * 4)];
        });
      }

      // Force update by creating new array
      this.demoDrones = [...this.demoDrones];
    }, 500);
  }
}
