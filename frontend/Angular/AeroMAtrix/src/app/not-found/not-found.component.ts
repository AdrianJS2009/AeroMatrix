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
    // Fade in animation for smooth element entrance
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
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  currentPath = '';

  constructor(
    private readonly router: Router,
    private readonly translateService: TranslateService
  ) {
    // Get current URL path from the browser
    this.currentPath = window.location.pathname;
  }

  // Navigate to the home route
  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  // Navigate back to the previous page in history
  goBack(): void {
    window.history.back();
  }
}
