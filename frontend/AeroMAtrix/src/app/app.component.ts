import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenubarModule],
  template: `
    <p-menubar [model]="items" styleClass="mb-3"></p-menubar>
    <main class="container">
      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  items: MenuItem[] = [
    { label: 'Drones', routerLink: '/drones' },
    { label: 'Matrices', routerLink: '/matrices' },
    { label: 'Vuelos', routerLink: '/flights' },
  ];
}
