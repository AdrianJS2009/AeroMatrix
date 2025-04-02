import type { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ShellComponent } from './layout/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    component: ShellComponent,
    children: [
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
      {
        path: 'analytics',
        loadComponent: () =>
          import('./analytics/analytics.component').then(
            (m) => m.AnalyticsComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
    ],
  },
];
