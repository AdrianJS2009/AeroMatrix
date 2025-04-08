import { Routes } from '@angular/router';
import { DroneListComponent } from './components/dron-list/drone-list.component';

export const DRONE_ROUTES: Routes = [
  {
    path: '',
    component: DroneListComponent,
  },
];
