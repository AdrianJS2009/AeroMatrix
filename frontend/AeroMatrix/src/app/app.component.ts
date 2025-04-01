import { Component, type OnInit } from '@angular/core';
import type { MessageService } from 'primeng/api';
import type { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Drone Management System';

  constructor(
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.notificationService.connect();

    this.notificationService.notifications$.subscribe((message) => {
      this.messageService.add({
        severity: 'info',
        summary: 'Notification',
        detail: message,
      });
    });

    this.notificationService.droneUpdates$.subscribe((drone) => {
      this.messageService.add({
        severity: 'info',
        summary: 'Drone Update',
        detail: `Drone ${drone.name} updated: (${drone.x}, ${drone.y}, ${drone.orientation})`,
      });
    });
  }
}
