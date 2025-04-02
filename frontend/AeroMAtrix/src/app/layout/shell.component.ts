import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <app-header (toggleSidebar)="sidebarVisible = !sidebarVisible" />
    <app-sidebar [visible]="sidebarVisible" (close)="sidebarVisible = false" />

    <main class="p-4" style="margin-top: 60px;">
      <router-outlet />
    </main>
  `,
})
export class ShellComponent {
  sidebarVisible = false;
}
