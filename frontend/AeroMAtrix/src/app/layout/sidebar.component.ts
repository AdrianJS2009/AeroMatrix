import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import type { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ThemeService } from '../core/services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    PanelMenuModule,
    ButtonModule,
  ],
  template: `
    <div class="sidebar-wrapper">
      <div class="sidebar-header">
        <i class="pi pi-sitemap logo-icon"></i>
        <h2 class="brand-name">AeroMatrix</h2>
      </div>

      <p-panelMenu
        [model]="menuItems"
        [style]="{ width: '100%' }"
        styleClass="custom-panel-menu"
      ></p-panelMenu>

      <div class="theme-toggle">
        <button
          pButton
          icon="pi pi-sun"
          (click)="toggleTheme()"
          [class.p-button-secondary]="!isDarkMode"
          class="p-button-text p-button-rounded"
        ></button>
        <button
          pButton
          icon="pi pi-moon"
          (click)="toggleTheme()"
          [class.p-button-secondary]="isDarkMode"
          class="p-button-text p-button-rounded"
        ></button>
      </div>
    </div>
  `,
  styles: [
    `
      .sidebar-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: var(--surface-card);
        padding: 1rem;
      }

      .sidebar-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .logo-icon {
        font-size: 1.75rem;
        color: var(--primary-500);
      }

      .brand-name {
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--text-color);
      }

      .theme-toggle {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-top: auto;
        padding-top: 1rem;
        border-top: 1px solid var(--surface-border);
      }

      :host ::ng-deep .custom-panel-menu .p-menuitem {
        border-radius: 6px;
      }

      :host ::ng-deep .custom-panel-menu .p-menuitem:hover {
        background-color: var(--surface-hover);
      }
    `,
  ],
})
export class SidebarComponent implements OnInit {
  isDarkMode = false;

  menuItems: MenuItem[] = [];

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/'],
      },
      {
        label: 'Drones',
        icon: 'pi pi-send',
        routerLink: ['/drones'],
      },
      {
        label: 'Matrices',
        icon: 'pi pi-th-large',
        routerLink: ['/matrices'],
      },
      {
        label: 'Flights',
        icon: 'pi pi-compass',
        routerLink: ['/flights'],
      },
      {
        label: 'Analytics',
        icon: 'pi pi-chart-bar',
        routerLink: ['/analytics'],
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        routerLink: ['/settings'],
      },
      {
        label: 'About',
        icon: 'pi pi-info-circle',
        routerLink: ['/about'],
      },
      {
        label: 'Features',
        icon: 'pi pi-star',
        routerLink: ['/features'],
      },
      {
        label: 'Support',
        icon: 'pi pi-question-circle',
        routerLink: ['/support'],
      },
    ];

    this.themeService.currentTheme$.subscribe((theme) => {
      this.isDarkMode = theme === 'dark';
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
