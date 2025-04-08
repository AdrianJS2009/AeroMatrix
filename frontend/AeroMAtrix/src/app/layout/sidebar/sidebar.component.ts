import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import type { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ThemeService } from '../../core/services/theme.service';

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
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isDarkMode = false;
  menuItems: MenuItem[] = [];

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.menuItems = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/'] },
      { label: 'Drones', icon: 'pi pi-send', routerLink: ['/drones'] },
      { label: 'Matrices', icon: 'pi pi-th-large', routerLink: ['/matrices'] },
      { label: 'Flights', icon: 'pi pi-compass', routerLink: ['/flights'] },
      {
        label: 'Analytics',
        icon: 'pi pi-chart-bar',
        routerLink: ['/analytics'],
      },
      { label: 'Settings', icon: 'pi pi-cog', routerLink: ['/settings'] },
      { label: 'About', icon: 'pi pi-info-circle', routerLink: ['/about'] },
      { label: 'Features', icon: 'pi pi-star', routerLink: ['/features'] },
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
