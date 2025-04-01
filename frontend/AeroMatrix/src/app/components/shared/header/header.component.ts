import { Component, type OnInit } from '@angular/core';
import type { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/dashboard'],
      },
      {
        label: 'Matrices',
        icon: 'pi pi-fw pi-th-large',
        routerLink: ['/matrices'],
      },
      {
        label: 'Drones',
        icon: 'pi pi-fw pi-send',
        routerLink: ['/drones'],
      },
      {
        label: 'Flight Control',
        icon: 'pi pi-fw pi-compass',
        items: [
          {
            label: 'Single Drone Control',
            icon: 'pi pi-fw pi-directions',
            routerLink: ['/flight-control'],
          },
          {
            label: 'Batch Commands',
            icon: 'pi pi-fw pi-sitemap',
            routerLink: ['/batch-commands'],
          },
        ],
      },
    ];
  }
}
