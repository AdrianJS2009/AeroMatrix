import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    RippleModule,
    RouterModule,
    TranslateModule,
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
  ],
  template: `
    <div class="not-found-container">
      <div class="not-found-content" @fadeIn>
        <div class="error-code">404</div>

        <div class="drone-animation">
          <div class="drone">
            <div class="drone-body"></div>
            <div class="drone-propeller propeller-1"></div>
            <div class="drone-propeller propeller-2"></div>
            <div class="drone-propeller propeller-3"></div>
            <div class="drone-propeller propeller-4"></div>
            <div class="drone-camera"></div>
          </div>
        </div>

        <h1>{{ 'error.pageNotFound' | translate }}</h1>
        <p>{{ 'error.pageNotFoundMessage' | translate }}</p>

        <div class="action-buttons">
          <button
            pButton
            pRipple
            icon="pi pi-home"
            [label]="'error.returnHome' | translate"
            class="p-button-primary"
            (click)="navigateToHome()"
          ></button>

          <button
            pButton
            pRipple
            icon="pi pi-arrow-left"
            [label]="'error.goBack' | translate"
            class="p-button-outlined"
            (click)="goBack()"
          ></button>
        </div>

        <p-card styleClass="error-card">
          <ng-template pTemplate="header">
            <div class="error-card-header">
              <i class="pi pi-exclamation-triangle"></i>
              <span>{{ 'error.technicalInfo' | translate }}</span>
            </div>
          </ng-template>
          <p>{{ 'error.technicalMessage' | translate }}</p>
          <p class="error-path">
            <span>{{ 'error.requestedUrl' | translate }}:</span>
            <code>{{ currentPath }}</code>
          </p>
        </p-card>
      </div>

      <div class="background-elements">
        <div class="grid-lines"></div>
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        width: 100%;
      }

      .not-found-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
        position: relative;
        overflow: hidden;
        background: linear-gradient(
          135deg,
          var(--surface-ground) 0%,
          var(--surface-section) 100%
        );
      }

      .not-found-content {
        max-width: 800px;
        width: 100%;
        text-align: center;
        z-index: 10;
        padding: 2rem;
        border-radius: 1rem;
        background-color: var(--surface-card);
        box-shadow: var(--card-shadow);
      }

      .error-code {
        font-size: 10rem;
        font-weight: 900;
        line-height: 1;
        margin-bottom: 1rem;
        background: linear-gradient(
          135deg,
          var(--primary-color) 0%,
          var(--primary-400) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      }

      h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--text-color);
      }

      p {
        font-size: 1.25rem;
        color: var(--text-color-secondary);
        margin-bottom: 2rem;
        line-height: 1.6;
      }

      .action-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 2rem;
      }

      .error-card {
        margin-top: 2rem;
        text-align: left;
      }

      .error-card-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        background-color: var(--surface-section);
        border-radius: 6px 6px 0 0;
      }

      .error-card-header i {
        color: var(--yellow-500);
        font-size: 1.25rem;
      }

      .error-path {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1rem;
        font-size: 0.875rem;
      }

      .error-path code {
        background-color: var(--surface-section);
        padding: 0.5rem;
        border-radius: 4px;
        font-family: monospace;
        word-break: break-all;
      }

      .background-elements {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        overflow: hidden;
      }

      .grid-lines {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
            var(--surface-border) 1px,
            transparent 1px
          ),
          linear-gradient(90deg, var(--surface-border) 1px, transparent 1px);
        background-size: 50px 50px;
        opacity: 0.1;
      }

      .shape {
        position: absolute;
        border-radius: 50%;
        opacity: 0.05;
      }

      .shape-1 {
        width: 400px;
        height: 400px;
        background: var(--primary-color);
        top: -100px;
        right: -100px;
      }

      .shape-2 {
        width: 300px;
        height: 300px;
        background: var(--primary-color);
        bottom: -50px;
        left: 10%;
      }

      .shape-3 {
        width: 200px;
        height: 200px;
        background: var(--primary-color);
        top: 20%;
        left: 20%;
      }

      .drone-animation {
        width: 150px;
        height: 150px;
        margin: 0 auto 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: float 3s ease-in-out infinite alternate;
      }

      .drone {
        position: relative;
        width: 100px;
        height: 30px;
      }

      .drone-body {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: var(--primary-700);
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }

      .drone-propeller {
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: var(--primary-300);
        border: 3px solid var(--primary-500);
        animation: spin 0.5s linear infinite;
      }

      .propeller-1 {
        top: -15px;
        left: 0;
      }

      .propeller-2 {
        top: -15px;
        right: 0;
      }

      .propeller-3 {
        bottom: -15px;
        left: 0;
      }

      .propeller-4 {
        bottom: -15px;
        right: 0;
      }

      .drone-camera {
        position: absolute;
        width: 15px;
        height: 15px;
        background-color: var(--surface-900);
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 2px solid var(--surface-700);
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes float {
        from {
          transform: translateY(0);
        }
        to {
          transform: translateY(-20px);
        }
      }

      @media screen and (max-width: 768px) {
        .error-code {
          font-size: 6rem;
        }

        h1 {
          font-size: 1.75rem;
        }

        p {
          font-size: 1rem;
        }

        .action-buttons {
          flex-direction: column;
        }

        .drone {
          transform: scale(0.8);
        }
      }

      @media screen and (max-width: 480px) {
        .not-found-content {
          padding: 1.5rem;
        }

        .error-code {
          font-size: 5rem;
        }
      }
    `,
  ],
})
export class NotFoundComponent {
  currentPath = '';

  constructor(
    private readonly router: Router,
    private readonly translateService: TranslateService
  ) {
    this.currentPath = window.location.pathname;
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    window.history.back();
  }
}
