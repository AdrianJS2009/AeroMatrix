import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarModule, RouterModule, PanelMenuModule],
  template: `
    <p-sidebar
      [(visible)]="visible"
      [modal]="true"
      position="left"
      (onHide)="close.emit()"
    >
      <p-panelMenu [model]="items" />
    </p-sidebar>
  `,
})
export class SidebarComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  items: MenuItem[] = [
    {
      label: 'Gestión',
      items: [
        { label: 'Drones', icon: 'pi pi-fw pi-send', routerLink: '/drones' },
        {
          label: 'Matrices',
          icon: 'pi pi-fw pi-th-large',
          routerLink: '/matrices',
        },
        {
          label: 'Vuelos',
          icon: 'pi pi-fw pi-compass',
          routerLink: '/flights',
        },
      ],
    },
  ];
}
