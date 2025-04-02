import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="p-4">
      <router-outlet />
    </main>
  `,
})
export class ShellComponent {}
