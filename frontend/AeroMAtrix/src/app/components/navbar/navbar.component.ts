import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  items = [
    { label: 'Matrices', routerLink: '/matrices' },
    { label: 'Drones', routerLink: '/drones' },
    { label: 'Flight Control', routerLink: '/flight-control' },
  ];
}
