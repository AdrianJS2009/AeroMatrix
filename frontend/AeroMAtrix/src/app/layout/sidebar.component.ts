import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import type { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import type { Theme } from '../core/theme.service';
import { ThemeService } from '../core/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MenuModule,
    SidebarModule,
    ButtonModule,
  ],
  template: `
    <div class="sidebar">
      <div class="logo-container">
        <img src="assets/logo.png" alt="Logo" class="logo" />
        <h2>DroneMatrix</h2>
      </div>
      <div class="menu-container">
        <ul class="menu">
          <li
            *ngFor="let item of menuItems"
            [routerLink]="item.routerLink"
            routerLinkActive="active"
          >
            <i [class]="item.icon"></i>
            <span>{{ item.label || 'Unknown' | translate }}</span>
          </li>
        </ul>
      </div>
      <div class="theme-toggle">
        <p-button
          icon="pi pi-sun"
          (onClick)="toggleTheme()"
          [styleClass]="
            isDarkMode
              ? 'p-button-rounded p-button-text'
              : 'p-button-rounded p-button-text p-button-secondary'
          "
        ></p-button>
        <p-button
          icon="pi pi-moon"
          (onClick)="toggleTheme()"
          [styleClass]="
            !isDarkMode
              ? 'p-button-rounded p-button-text'
              : 'p-button-rounded p-button-text p-button-secondary'
          "
        ></p-button>
      </div>
    </div>
  `,
  styles: [
    `
      .sidebar {
        height: 100%;
        width: 250px;
        background-color: var(--surface-card);
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.02), 0 0 2px rgba(0, 0, 0, 0.05),
          0 1px 4px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-direction: column;
      }

      .logo-container {
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border-bottom: 1px solid var(--surface-border);
      }

      .logo {
        width: 40px;
        height: 40px;
      }

      .menu-container {
        flex: 1;
        padding: 1rem 0;
        overflow-y: auto;
      }

      .menu {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .menu li {
        padding: 0.75rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .menu li:hover {
        background-color: var(--surface-hover);
      }

      .menu li.active {
        background-color: var(--primary-color);
        color: var(--primary-color-text);
      }

      .menu li i {
        font-size: 1.25rem;
      }

      .theme-toggle {
        padding: 1rem 1.5rem;
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        border-top: 1px solid var(--surface-border);
      }
    `,
  ],
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  isDarkMode = false;

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Drones',
        icon: 'pi pi-send',
        routerLink: '/drones',
      },
      {
        label: 'Matrices',
        icon: 'pi pi-th-large',
        routerLink: '/matrices',
      },
      {
        label: 'Flights',
        icon: 'pi pi-map',
        routerLink: '/flights',
      },
      {
        label: 'Analytics',
        icon: 'pi pi-chart-bar',
        routerLink: '/analytics',
      },
      {
        label: 'Features',
        icon: 'pi pi-star',
        routerLink: '/features',
      },
      {
        label: 'Support',
        icon: 'pi pi-question-circle',
        routerLink: '/support',
      },
      {
        label: 'About Us',
        icon: 'pi pi-info-circle',
        routerLink: '/about',
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        routerLink: '/settings',
      },
    ];

    this.themeService.currentTheme$.subscribe((theme: Theme) => {
      this.isDarkMode = theme === 'dark';
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
