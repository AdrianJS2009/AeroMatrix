import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/drones',
    pathMatch: 'full',
  },
  {
    path: 'drones',
    loadChildren: () =>
      import('./drones/drones.routes').then((m) => m.DRONE_ROUTES),
  },
  {
    path: 'matrices',
    loadChildren: () =>
      import('./matrices/matrices.routes').then((m) => m.MATRIX_ROUTES),
  },
  {
    path: 'flights',
    loadChildren: () =>
      import('./flights/flights.routes').then((m) => m.FLIGHT_ROUTES),
  },
];
