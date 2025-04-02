import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    CardModule,
    DividerModule,
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
    trigger('staggered', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(
          '600ms 300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('flyIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate(
          '800ms 600ms ease-out',
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
            <h1>DroneMatrix Control System</h1>
            <p>
              Advanced drone fleet management and control platform for precision
              operations
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
                label="Learn More"
                icon="pi pi-info-circle"
                class="p-button-outlined p-button-lg"
              ></button>
            </div>
          </div>
          <div class="hero-image" @staggered>
            <div class="drone-animation">
              <div class="drone">
                <div class="drone-body"></div>
                <div class="propeller propeller-1"></div>
                <div class="propeller propeller-2"></div>
                <div class="propeller propeller-3"></div>
                <div class="propeller propeller-4"></div>
              </div>
              <div class="grid-matrix"></div>
            </div>
          </div>
        </div>
        <div class="wave-divider">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="var(--surface-ground)"
              fill-opacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="section-header" @fadeIn>
          <h2>Key Features</h2>
          <p>
            Powerful tools to manage your drone fleet with precision and
            efficiency
          </p>
        </div>

        <div class="features-grid">
          <p-card styleClass="feature-card" @flyIn>
            <ng-template pTemplate="header">
              <div class="feature-icon">
                <i class="pi pi-send"></i>
              </div>
            </ng-template>
            <h3>Drone Management</h3>
            <p>
              Easily add, edit, and monitor your entire drone fleet from a
              centralized dashboard
            </p>
          </p-card>

          <p-card styleClass="feature-card" @flyIn>
            <ng-template pTemplate="header">
              <div class="feature-icon">
                <i class="pi pi-th-large"></i>
              </div>
            </ng-template>
            <h3>Matrix Configuration</h3>
            <p>
              Define operational boundaries and coordinate systems for precise
              drone positioning
            </p>
          </p-card>

          <p-card styleClass="feature-card" @flyIn>
            <ng-template pTemplate="header">
              <div class="feature-icon">
                <i class="pi pi-compass"></i>
              </div>
            </ng-template>
            <h3>Flight Control</h3>
            <p>
              Execute complex flight patterns with intuitive command sequences
              and real-time feedback
            </p>
          </p-card>

          <p-card styleClass="feature-card" @flyIn>
            <ng-template pTemplate="header">
              <div class="feature-icon">
                <i class="pi pi-chart-bar"></i>
              </div>
            </ng-template>
            <h3>Analytics Dashboard</h3>
            <p>
              Gain insights from operational data with comprehensive analytics
              and reporting tools
            </p>
          </p-card>
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
            label="Launch Dashboard"
            icon="pi pi-arrow-right"
            class="p-button-lg"
            (click)="navigateTo('/drones')"
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
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
      color: white;
      padding: 6rem 2rem 8rem;
      position: relative;
    }
    
    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }
    
    .hero-text {
      flex: 1;
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
      max-width: 600px;
    }
    
    .hero-buttons {
      display: flex;
      gap: 1rem;
    }
    
    .hero-image {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .wave-divider {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      line-height: 0;
    }
    
    /* Drone Animation */
    .drone-animation {
      position: relative;
      width: 400px;
      height: 400px;
    }
    
    .drone {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      animation: hover 4s ease-in-out infinite;
    }
    
    .drone-body {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      background-color: white;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    }
    
    .propeller {
      position: absolute;
      width: 40px;
      height: 8px;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 4px;
    }
    
    .propeller-1 {
      top: 10px;
      left: 40px;255,255,0.8);
      border-radius: 4px;
    }
    
    .propeller-1 {
      top: 10px;
      left: 40px;
      animation: spin 0.5s linear infinite;
    }
    
    .propeller-2 {
      top: 56px;
      left: 10px;
      transform: rotate(90deg);
      animation: spin 0.5s linear infinite;
    }
    
    .propeller-3 {
      top: 106px;
      left: 40px;
      animation: spin 0.5s linear infinite;
    }
    
    .propeller-4 {
      top: 56px;
      left: 70px;
      transform: rotate(90deg);
      animation: spin 0.5s linear infinite;
    }
    
    .grid-matrix {
      position: absolute;
      top: 60%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 300px;
      height: 300px;
      background: 
        linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px) 0 0,
        linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px) 0 0;
      background-size: 30px 30px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 4px;
      box-shadow: 0 0 30px rgba(0,0,0,0.1);
    }
    
    @keyframes hover {
      0%, 100% { transform: translate(-50%, -50%); }
      50% { transform: translate(-50%, -60%); }
    }
    
    @keyframes spin {
      0% { transform: rotateY(0deg); }
      100% { transform: rotateY(360deg); }
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
    
    :host ::ng-deep .feature-card {
      height: 100%;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border-radius: 12px;
      overflow: hidden;
    }
    
    :host ::ng-deep .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    :host ::ng-deep .feature-card .p-card-body {
      padding: 1.5rem;
    }
    
    .feature-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 120px;
      background: linear-gradient(135deg, var(--primary-200) 0%, var(--primary-400) 100%);
    }
    
    .feature-icon i {
      font-size: 3rem;
      color: white;
    }
    
    :host ::ng-deep .feature-card h3 {
      font-size: 1.5rem;
      margin: 1rem 0;
      color: var(--text-color);
    }
    
    :host ::ng-deep .feature-card p {
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
    @media screen and (max-width: 992px) {
      .hero-content {
        flex-direction: column;
      }
      
      .hero-text h1 {
        font-size: 2.5rem;
      }
      
      .drone-animation {
        width: 300px;
        height: 300px;
      }
    }
    
    @media screen and (max-width: 768px) {
      .hero-section {
        padding: 4rem 1.5rem 6rem;
      }
      
      .hero-text h1 {
        font-size: 2rem;
      }
      
      .hero-text p {
        font-size: 1rem;
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
export class LandingPageComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
