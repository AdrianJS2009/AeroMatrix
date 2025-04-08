import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
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
import { SidebarComponent } from './layout/sidebar.component';

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
  template: `
    <div
      class="app-container"
      [ngClass]="{
        'sidebar-open': sidebarVisible,
        'sidebar-collapsed': sidebarCollapsed && !sidebarVisible
      }"
    >
      <!-- Header -->
      <header class="app-header">
        <div class="header-content">
          <div class="header-left">
            <button
              pButton
              pRipple
              type="button"
              icon="pi pi-bars"
              class="p-button-text p-button-rounded sidebar-toggle"
              (click)="toggleSidebar()"
              [ngClass]="{ active: sidebarVisible }"
            ></button>
            <div class="logo-container" (click)="navigateHome()">
              <i class="pi pi-send logo-icon"></i>
              <h1 class="logo-text gradient-text">AeroMatrix</h1>
            </div>
          </div>

          <div class="header-right">
            <!-- Theme Toggle -->
            <button
              pButton
              pRipple
              type="button"
              [icon]="isDarkTheme ? 'pi pi-sun' : 'pi pi-moon'"
              class="p-button-text p-button-rounded theme-toggle"
              (click)="toggleTheme()"
              pTooltip="{{ 'HEADER.TOGGLE_THEME' | translate }}"
            ></button>

            <!-- Language Selector -->
            <button
              pButton
              pRipple
              type="button"
              icon="pi pi-globe"
              class="p-button-text p-button-rounded"
              (click)="langPanel.toggle($event)"
              pTooltip="{{ 'HEADER.LANGUAGE' | translate }}"
            ></button>

            <button
              pButton
              pRipple
              type="button"
              icon="pi pi-bell"
              class="p-button-text p-button-rounded notification-btn"
              (click)="op.toggle($event)"
              pBadge
              value="2"
            ></button>

            <p-avatar
              icon="pi pi-user"
              shape="circle"
              class="user-avatar"
              (click)="userPanel.toggle($event)"
            ></p-avatar>
          </div>
        </div>
      </header>

      <div class="main-container">
        <!-- Sidebar -->
        <!-- Sidebar -->
        <p-sidebar
          [(visible)]="sidebarVisible"
          [showCloseIcon]="false"
          [modal]="false"
          styleClass="app-sidebar"
          [baseZIndex]="10000"
          position="left"
          @slideInOut
        >
          <!-- Renderiza el componente Sidebar solo cuando está visible -->
          <app-sidebar *ngIf="sidebarVisible" />
        </p-sidebar>

        <!-- Collapsed Sidebar -->
        <div
          class="collapsed-sidebar"
          *ngIf="sidebarCollapsed && !sidebarVisible"
        >
          <div class="collapsed-sidebar-content">
            <button
              pButton
              pRipple
              type="button"
              icon="pi pi-angle-right"
              class="p-button-text p-button-rounded expand-btn"
              (click)="expandSidebar()"
              pTooltip="{{ 'SIDEBAR.EXPAND' | translate }}"
            ></button>

            <ul class="collapsed-menu">
              <li
                *ngFor="let item of menuItems"
                [ngClass]="{ active: isActive(item.routerLink) }"
                (click)="navigateTo(item.routerLink)"
                pTooltip="{{ item.label ?? '' | translate }}"
                tooltipPosition="right"
                @slideUpDown
              >
                <i [class]="item.icon"></i>
              </li>
            </ul>
          </div>
        </div>

        <!-- Main Content -->
        <main
          class="app-content"
          [@fadeAnimation]="o.isActivated ? o.activatedRoute : ''"
        >
          <router-outlet #o="outlet"></router-outlet>
        </main>
      </div>

      <!-- Footer -->
      <footer class="app-footer">
        <div class="footer-content">
          <div class="copyright">
            &copy; {{ currentYear }} AeroMatrix.
            {{ 'FOOTER.RIGHTS' | translate }}
          </div>
          <div class="attribution">
            {{ 'FOOTER.CREATED_BY' | translate }}
          </div>
        </div>
      </footer>

      <!-- Notification Panel -->
      <p-overlayPanel #op [showCloseIcon]="true" [style]="{ width: '350px' }">
        <ng-template pTemplate>
          <div class="notification-panel">
            <h3>{{ 'NOTIFICATIONS.TITLE' | translate }}</h3>
            <div class="notification-item unread" @slideUpDown>
              <i class="pi pi-exclamation-circle"></i>
              <div class="notification-content">
                <h4>{{ 'NOTIFICATIONS.DRONE_ALERT' | translate }}</h4>
                <p>{{ 'NOTIFICATIONS.DRONE_ALERT_DESC' | translate }}</p>
                <span class="notification-time">{{
                  'NOTIFICATIONS.TIME_AGO.MINUTES' | translate : { minutes: 5 }
                }}</span>
              </div>
            </div>
            <div class="notification-item unread" @slideUpDown>
              <i class="pi pi-check-circle"></i>
              <div class="notification-content">
                <h4>{{ 'NOTIFICATIONS.FLIGHT_COMPLETED' | translate }}</h4>
                <p>{{ 'NOTIFICATIONS.FLIGHT_COMPLETED_DESC' | translate }}</p>
                <span class="notification-time">{{
                  'NOTIFICATIONS.TIME_AGO.HOURS' | translate : { hours: 1 }
                }}</span>
              </div>
            </div>
            <div class="notification-item" @slideUpDown>
              <i class="pi pi-info-circle"></i>
              <div class="notification-content">
                <h4>{{ 'NOTIFICATIONS.SYSTEM_UPDATE' | translate }}</h4>
                <p>{{ 'NOTIFICATIONS.SYSTEM_UPDATE_DESC' | translate }}</p>
                <span class="notification-time">{{
                  'NOTIFICATIONS.TIME_AGO.DAYS' | translate : { days: 1 }
                }}</span>
              </div>
            </div>
            <div class="view-all">
              <a href="#">{{ 'NOTIFICATIONS.VIEW_ALL' | translate }}</a>
            </div>
          </div>
        </ng-template>
      </p-overlayPanel>

      <!-- Language Panel -->
      <p-overlayPanel
        #langPanel
        [showCloseIcon]="true"
        [style]="{ width: '250px' }"
      >
        <ng-template pTemplate>
          <div class="language-panel">
            <h3>{{ 'LANGUAGE.SELECT' | translate }}</h3>
            <ul class="language-list">
              <li
                *ngFor="let lang of availableLanguages"
                [ngClass]="{ active: currentLanguage.code === lang.code }"
                (click)="setLanguage(lang)"
                @slideUpDown
              >
                <span>{{ lang.name }}</span>
                <i
                  class="pi pi-check"
                  *ngIf="currentLanguage.code === lang.code"
                ></i>
              </li>
            </ul>
          </div>
        </ng-template>
      </p-overlayPanel>

      <!-- User Panel -->
      <p-overlayPanel
        #userPanel
        [showCloseIcon]="true"
        [style]="{ width: '250px' }"
      >
        <ng-template pTemplate>
          <div class="user-panel">
            <div class="user-info">
              <p-avatar
                icon="pi pi-user"
                size="large"
                shape="circle"
              ></p-avatar>
              <div class="user-details">
                <h4>{{ 'USER.ADMIN' | translate }}</h4>
                <p>{{ 'USER.ROLE' | translate }}</p>
              </div>
            </div>
            <ul class="user-menu">
              <li @slideUpDown>
                <i class="pi pi-user-edit"></i>
                {{ 'USER.EDIT_PROFILE' | translate }}
              </li>
              <li (click)="navigateTo('/settings')" @slideUpDown>
                <i class="pi pi-cog"></i> {{ 'USER.SETTINGS' | translate }}
              </li>
              <li @slideUpDown>
                <i class="pi pi-sign-out"></i> {{ 'USER.LOGOUT' | translate }}
              </li>
            </ul>
          </div>
        </ng-template>
      </p-overlayPanel>

      <!-- Toast and Confirm Dialog -->
      <p-toast></p-toast>
      <p-confirmDialog
        [style]="{ width: '450px' }"
        styleClass="custom-confirm-dialog"
        acceptButtonStyleClass="p-button-danger"
        rejectButtonStyleClass="p-button-text"
      ></p-confirmDialog>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        width: 100vw;
      }

      .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
        background-color: var(--surface-ground);
        transition: all 0.3s ease;
        overflow: hidden;
      }

      /* Header Styles */
      .app-header {
        background-color: var(--surface-card);
        box-shadow: var(--shadow-md);
        padding: 0.75rem 1.5rem;
        z-index: 1000;
        position: relative;
        flex-shrink: 0;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .header-left,
      .header-right {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .logo-container {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        transition: transform 0.3s ease;
      }

      .logo-container:hover {
        transform: translateY(-2px);
      }

      .logo-icon {
        font-size: 1.5rem;
        color: var(--primary-500);
      }

      .logo-text {
        font-size: 1.35rem;
        font-weight: 700;
        margin: 0;
        letter-spacing: -0.02em;
      }

      .sidebar-toggle {
        transition: transform 0.3s ease;
      }

      .sidebar-toggle.active {
        transform: rotate(90deg);
      }

      .theme-toggle,
      .user-avatar {
        cursor: pointer;
        transition: transform 0.2s ease, background-color 0.2s ease;
      }

      .theme-toggle:hover,
      .user-avatar:hover {
        transform: scale(1.1);
        background-color: var(--surface-hover);
      }

      /* Main Container */
      .main-container {
        display: flex;
        flex: 1;
        overflow: hidden;
        position: relative;
      }

      /* Sidebar Styles */
      :host ::ng-deep .app-sidebar {
        width: 280px !important;
        box-shadow: var(--shadow-lg);
        position: relative;
        z-index: 999;
        height: 100%;
      }

      :host ::ng-deep .app-sidebar .p-sidebar-content {
        padding: 0;
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: var(--surface-card);
      }

      .sidebar-header {
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        border-bottom: 1px solid var(--surface-border);
        font-size: 1.2rem;
        font-weight: 600;
        position: relative;
      }

      .sidebar-header i {
        color: var(--primary-500);
      }

      .collapse-btn {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
      }

      .sidebar-menu {
        padding: 1rem 0;
        flex: 1;
        overflow-y: auto;
      }

      .sidebar-menu ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .sidebar-menu li {
        padding: 0.85rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        cursor: pointer;
        position: relative;
        transition: all 0.2s ease;
        border-radius: 0.5rem;
        margin: 0.25rem 0.75rem;
      }

      .sidebar-menu li:hover {
        background-color: var(--surface-hover);
      }

      .sidebar-menu li.active {
        background-color: var(--primary-50);
        color: var(--primary-700);
        font-weight: 500;
      }

      .sidebar-menu li.active i {
        color: var(--primary-600);
      }

      .sidebar-menu li i {
        font-size: 1.2rem;
        width: 1.5rem;
        text-align: center;
      }

      .hover-indicator {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background-color: var(--primary-500);
        transform: scaleY(0);
        transition: transform 0.2s ease;
        border-radius: 0 4px 4px 0;
      }

      .sidebar-menu li:hover .hover-indicator,
      .sidebar-menu li.active .hover-indicator {
        transform: scaleY(1);
      }

      .sidebar-footer {
        padding: 1.25rem 1.5rem;
        border-top: 1px solid var(--surface-border);
        margin-top: auto;
      }

      .system-info {
        display: flex;
        flex-direction: column;
        font-size: 0.875rem;
        color: var(--text-color-secondary);
      }

      .version {
        font-size: 0.75rem;
        opacity: 0.7;
        margin-top: 0.25rem;
      }

      /* Collapsed Sidebar */
      .collapsed-sidebar {
        width: 70px;
        background-color: var(--surface-card);
        box-shadow: var(--shadow-md);
        z-index: 999;
        height: 100%;
        flex-shrink: 0;
      }

      .collapsed-sidebar-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 1rem 0;
      }

      .expand-btn {
        align-self: center;
        margin-bottom: 1.5rem;
      }

      .collapsed-menu {
        list-style: none;
        padding: 0;
        margin: 0;
        flex: 1;
        overflow-y: auto;
      }

      .collapsed-menu li {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        cursor: pointer;
        position: relative;
        transition: all 0.2s ease;
        margin: 0.5rem 0.5rem;
        border-radius: 0.5rem;
      }

      .collapsed-menu li i {
        font-size: 1.2rem;
        color: var(--text-color-secondary);
      }

      .collapsed-menu li.active i {
        color: var(--primary-600);
      }

      .collapsed-menu li:hover {
        background-color: var(--surface-hover);
      }

      .collapsed-menu li.active {
        background-color: var(--primary-50);
      }

      .collapsed-menu li.active::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background-color: var(--primary-500);
        border-radius: 0 4px 4px 0;
      }

      /* Main Content */
      .app-content {
        flex: 1;
        padding: 1.5rem;
        overflow-y: auto;
        transition: all 0.3s ease;
        height: 100%;
      }

      /* Footer */
      .app-footer {
        background-color: var(--surface-card);
        border-top: 1px solid var(--surface-border);
        padding: 1rem 1.5rem;
        text-align: center;
        font-size: 0.875rem;
        color: var(--text-color-secondary);
        flex-shrink: 0;
      }

      .footer-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      /* Notification Panel */
      .notification-panel h3 {
        margin-top: 0;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--surface-border);
        font-size: 1.1rem;
        font-weight: 600;
      }

      .notification-item {
        display: flex;
        padding: 0.85rem 0;
        border-bottom: 1px solid var(--surface-200);
        gap: 0.85rem;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .notification-item:hover {
        background-color: var(--surface-100);
      }

      .notification-item i {
        font-size: 1.2rem;
        color: var(--primary-500);
        margin-top: 0.25rem;
      }

      .notification-content {
        flex: 1;
      }

      .notification-content h4 {
        margin: 0 0 0.25rem 0;
        font-size: 0.95rem;
        font-weight: 600;
      }

      .notification-content p {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        line-height: 1.4;
      }

      .notification-time {
        font-size: 0.75rem;
        color: var(--text-color-secondary);
        display: block;
        margin-top: 0.35rem;
      }

      .notification-item.unread h4::after {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--primary-500);
        margin-left: 0.5rem;
      }

      .view-all {
        text-align: center;
        padding: 0.75rem 0 0;
      }

      .view-all a {
        color: var(--primary-600);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        transition: color 0.2s ease;
      }

      .view-all a:hover {
        color: var(--primary-700);
        text-decoration: underline;
      }

      /* Language Panel */
      .language-panel h3 {
        margin-top: 0;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--surface-border);
        font-size: 1.1rem;
        font-weight: 600;
      }

      .language-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .language-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0.75rem;
        cursor: pointer;
        border-radius: 0.5rem;
        transition: background-color 0.2s ease;
        margin: 0.25rem 0;
      }

      .language-list li:hover {
        background-color: var(--surface-100);
      }

      .language-list li.active {
        background-color: var(--primary-50);
        color: var(--primary-700);
        font-weight: 500;
      }

      /* User Panel */
      .user-panel {
        padding: 0.75rem 0;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1rem 1.25rem;
        border-bottom: 1px solid var(--surface-border);
      }

      .user-details h4 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
      }

      .user-details p {
        margin: 0.25rem 0 0;
        font-size: 0.875rem;
        color: var(--text-color-secondary);
      }

      .user-menu {
        list-style: none;
        padding: 0;
        margin: 0.75rem 0 0;
      }

      .user-menu li {
        padding: 0.65rem 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transition: background-color 0.2s ease;
        border-radius: 0.5rem;
        margin: 0.25rem 0.5rem;
      }

      .user-menu li:hover {
        background-color: var(--surface-100);
      }

      .user-menu li i {
        font-size: 1rem;
        width: 1.5rem;
        color: var(--primary-600);
      }

      /* Custom Confirm Dialog */
      :host ::ng-deep .custom-confirm-dialog .p-dialog-content {
        padding: 2rem 1.5rem 1.5rem;
      }

      /* Responsive Adjustments */
      @media screen and (max-width: 768px) {
        .collapsed-sidebar {
          display: none;
        }

        .logo-text {
          font-size: 1.1rem;
        }

        :host ::ng-deep .app-sidebar {
          width: 100% !important;
        }

        .header-right {
          gap: 0.5rem;
        }
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  sidebarVisible = false;
  sidebarCollapsed = false;
  menuItems: MenuItem[] = [
    {
      label: 'MENU.DASHBOARD',
      icon: 'pi pi-home',
      routerLink: '/',
    },
    {
      label: 'MENU.DRONES',
      icon: 'pi pi-send',
      routerLink: '/drones',
    },
    {
      label: 'MENU.MATRICES',
      icon: 'pi pi-th-large',
      routerLink: '/matrices',
    },
    {
      label: 'MENU.FLIGHTS',
      icon: 'pi pi-compass',
      routerLink: '/flights',
    },
    {
      label: 'MENU.ANALYTICS',
      icon: 'pi pi-chart-bar',
      routerLink: '/analytics',
    },
    {
      label: 'MENU.SETTINGS',
      icon: 'pi pi-cog',
      routerLink: '/settings',
    },
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

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });

    // Subscribe to theme changes
    this.themeService.currentTheme$.subscribe((theme) => {
      this.isDarkTheme = theme === 'dark';
    });

    // Subscribe to language changes
    this.translationService.currentLanguage$.subscribe((language) => {
      this.currentLanguage = language;
    });
  }

  toggleSidebar() {
    if (this.sidebarCollapsed) {
      this.sidebarCollapsed = false;
      this.sidebarVisible = true;
    } else {
      this.sidebarVisible = !this.sidebarVisible;
    }
  }

  collapseSidebar() {
    this.sidebarVisible = false;
    this.sidebarCollapsed = true;
  }

  expandSidebar() {
    this.sidebarCollapsed = false;
    this.sidebarVisible = true;
  }

  navigateTo(route: string | undefined) {
    if (route) {
      this.router.navigate([route]);
      if (window.innerWidth < 768) {
        this.sidebarVisible = false;
      }
    }
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  isActive(route: string | undefined): boolean {
    if (!route) return false;
    return (
      this.currentRoute === route ||
      (route !== '/' && this.currentRoute.startsWith(route))
    );
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  setLanguage(language: Language) {
    this.translationService.setLanguage(language);
  }
}
