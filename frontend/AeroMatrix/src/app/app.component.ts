import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Drone Management System';

  constructor(private readonly messageService: MessageService) {}

  ngOnInit() {
    console.log('AppComponent initialized');
  }
}
