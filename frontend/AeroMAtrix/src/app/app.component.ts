import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenubarModule, ToastModule, ConfirmDialogModule],
  template: `
    <p-menubar [model]="items" styleClass="mb-3 shadow-1">
      <ng-template pTemplate="start">
        <div class="flex align-items-center gap-2 ml-2">
          <i class="pi pi-send text-xl"></i>
          <span class="font-bold text-xl">Drone Control</span>
        </div>
      </ng-template>
    </p-menubar>

    <main class="container mx-auto p-3">
      <router-outlet />
    </main>

    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
  `,
})
export class AppComponent {
  items: MenuItem[] = [
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
      label: 'Vuelos',
      icon: 'pi pi-compass',
      routerLink: '/flights',
    },
  ];
}
