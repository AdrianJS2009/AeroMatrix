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
          '600ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate(
          '800ms 300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate(
          '800ms 300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
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
            <h1>Advanced Drone Control System</h1>
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

          <div class="hero-matrix" @slideInRight>
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

      <!-- Call to Action -->
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
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="footer-content">
          <div class="footer-logo">
            <i class="pi pi-send"></i>
            <span>DroneMatrix</span>
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
            <a href="#"><i class="pi pi-github"></i></a>
            <a href="#"><i class="pi pi-twitter"></i></a>
            <a href="#"><i class="pi pi-linkedin"></i></a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 DroneMatrix Control System. All rights reserved.</p>
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
    
    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, var(--primary-900) 0%, var(--primary-700) 100%);
      color: white;
      padding: 4rem 2rem;
      position: relative;
    }
    
    .hero-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }
    
    .hero-text {
      flex: 1;
      max-width: 600px;
    }
    
    .hero-text h1 {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }
    
    .hero-text p {
      font-size: 1.25rem;
      margin-bottom: 2.5rem;
      opacity: 0.9;
    }
    
    .hero-buttons {
      display: flex;
      gap: 1rem;
    }
    
    .hero-matrix {
      flex: 1;
      max-width: 700px;
      height: 500px;
    }
    
    .matrix-demo {
      height: 100%;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    /* Features Section */
    .features-section {
      background-color: var(--surface-ground);
      padding: 5rem 2rem;
    }
    
    .section-header {
      text-align: center;
      max-width: 800px;
      margin: 0 auto 4rem;
    }
    
    .section-header h2 {
      font-size: 2.5rem;
      color: var(--text-color);
      margin-bottom: 1rem;
    }
    
    .section-header p {
      font-size: 1.2rem;
      color: var(--text-color-secondary);
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .feature-card {
      background-color: var(--surface-card);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    .feature-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, var(--primary-200) 0%, var(--primary-400) 100%);
      border-radius: 50%;
      margin-bottom: 1.5rem;
    }
    
    .feature-icon i {
      font-size: 2rem;
      color: white;
    }
    
    .feature-card h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--text-color);
    }
    
    .feature-card p {
      color: var(--text-color-secondary);
      line-height: 1.6;
    }
    
    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-900) 100%);
      color: white;
      padding: 5rem 2rem;
      text-align: center;
    }
    
    .cta-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .cta-content h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .cta-content p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    
    /* Footer */
    .landing-footer {
      background-color: var(--surface-900);
      color: white;
      padding: 4rem 2rem 1rem;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 2rem;
      margin-bottom: 3rem;
    }
    
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .footer-links ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
    }
    
    .footer-links a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    .footer-links a:255,255,0.8);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    .footer-links a:hover {
      color: white;
    }
    
    .footer-social {
      display: flex;
      gap: 1rem;
    }
    
    .footer-social a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      transition: background-color 0.2s ease;
    }
    
    .footer-social a:hover {
      background-color: var(--primary-color);
    }
    
    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
    }
    
    /* Responsive Adjustments */
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
    }
    
    @media screen and (max-width: 768px) {
      .hero-section {
        padding: 3rem 1.5rem;
      }
      
      .hero-text h1 {
        font-size: 2.5rem;
      }
      
      .hero-text p {
        font-size: 1.1rem;
      }
      
      .section-header h2 {
        font-size: 2rem;
      }
      
      .cta-content h2 {
        font-size: 2rem;
      }
      
      .footer-content {
        flex-direction: column;
        gap: 2rem;
      }
      
      .footer-links ul {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `,
  ],
})
export class LandingPageComponent implements OnInit {
  // Demo matrix and drones for the landing page
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

  constructor(private router: Router) {}

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

      // Move drones in different patterns
      this.demoDrones[0].x = 2 + Math.floor(Math.sin(step / 10) * 2);
      this.demoDrones[0].y = 3 + Math.floor(Math.cos(step / 10) * 2);

      this.demoDrones[1].x = 5 + Math.floor(Math.cos(step / 15) * 3);
      this.demoDrones[1].y = 7 + Math.floor(Math.sin(step / 15) * 2);

      this.demoDrones[2].x = 8 + Math.floor(Math.sin(step / 20) * 1);
      this.demoDrones[2].y = 2 + Math.floor(Math.cos(step / 20) * 3);

      this.demoDrones[3].x = 4 + Math.floor(Math.cos(step / 12) * 2);
      this.demoDrones[3].y = 5 + Math.floor(Math.sin(step / 12) * 2);

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
