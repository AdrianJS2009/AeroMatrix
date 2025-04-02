import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ToolbarModule, ButtonModule],
  template: `
    <p-toolbar styleClass="fixed top-0 left-0 right-0 z-5 shadow-1">
      <div class="p-toolbar-group-left">
        <button
          pButton
          icon="pi pi-bars"
          class="p-button-text"
          (click)="toggleSidebar.emit()"
        ></button>
        <span class="ml-2 font-bold">Drone Control</span>
      </div>
    </p-toolbar>
  `,
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
}
