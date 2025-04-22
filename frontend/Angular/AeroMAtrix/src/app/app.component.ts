import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import type { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenubarModule } from 'primeng/menubar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { filter } from 'rxjs/operators';
import { ThemeService } from './core/services/theme.service';
import {
  Language,
  TranslationService,
} from './core/services/translation.service';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenubarModule,
    ToastModule,
    ConfirmDialogModule,
    SidebarModule,
    SidebarComponent,
    ButtonModule,
    RippleModule,
    AvatarModule,
    BadgeModule,
    OverlayPanelModule,
    TranslateModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0 })),
      ]),
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate(
          '300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(-100%)' })
        ),
      ]),
    ]),
    trigger('slideUpDown', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate(
          '300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateY(20px)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  sidebarVisible = false;
  sidebarCollapsed = false;
  menuItems: MenuItem[] = [
    { label: 'MENU.DASHBOARD', icon: 'pi pi-home', routerLink: '/' },
    { label: 'MENU.DRONES', icon: 'pi pi-send', routerLink: '/drones' },
    { label: 'MENU.MATRICES', icon: 'pi pi-th-large', routerLink: '/matrices' },
    { label: 'MENU.FLIGHTS', icon: 'pi pi-compass', routerLink: '/flights' },
    {
      label: 'MENU.ANALYTICS',
      icon: 'pi pi-chart-bar',
      routerLink: '/analytics',
    },
    { label: 'MENU.SETTINGS', icon: 'pi pi-cog', routerLink: '/settings' },
  ];

  currentRoute = '';
  isDarkTheme = false;
  currentLanguage: Language;
  availableLanguages: Language[];
  currentYear = new Date().getFullYear();

  constructor(
    private readonly router: Router,
    private readonly themeService: ThemeService,
    private readonly translationService: TranslationService
  ) {
    this.currentLanguage = this.translationService.availableLanguages[0];
    this.availableLanguages = this.translationService.availableLanguages;
  }

  ngOnInit(): void {
    // Subscribe to route changes to update the currentRoute variable.
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });

    this.themeService.currentTheme$.subscribe((theme) => {
      this.isDarkTheme = theme === 'dark';
    });

    this.translationService.currentLanguage$.subscribe((language) => {
      this.currentLanguage = language;
    });
  }

  toggleSidebar(): void {
    if (this.sidebarCollapsed) {
      this.sidebarCollapsed = false;
      this.sidebarVisible = true;
    } else {
      this.sidebarVisible = !this.sidebarVisible;
    }
  }

  collapseSidebar(): void {
    this.sidebarVisible = false;
    this.sidebarCollapsed = true;
  }

  expandSidebar(): void {
    this.sidebarCollapsed = false;
    this.sidebarVisible = true;
  }

  navigateTo(route: string | undefined): void {
    if (route) {
      this.router.navigate([route]);
      if (window.innerWidth < 768) {
        this.sidebarVisible = false;
      }
    }
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }

  isActive(route: string | undefined): boolean {
    if (!route) return false;
    return (
      this.currentRoute === route ||
      (route !== '/' && this.currentRoute.startsWith(route))
    );
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  setLanguage(language: Language): void {
    this.translationService.setLanguage(language);
  }
}
