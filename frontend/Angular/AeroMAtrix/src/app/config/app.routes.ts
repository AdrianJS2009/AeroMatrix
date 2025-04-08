import type { Routes } from '@angular/router';
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { ShellComponent } from '../layout/shell/shell.component';

export const routes: Routes = [
  // Landing page route for the root path
  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full',
  },
  // Shell route layout for the main application
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'drones',
        loadChildren: () =>
          import('../drones/drones.routes').then((m) => m.DRONE_ROUTES),
      },
      {
        path: 'matrices',
        loadChildren: () =>
          import('../matrices/matrices.routes').then((m) => m.MATRIX_ROUTES),
      },
      {
        path: 'flights',
        loadChildren: () =>
          import('../flights/flights.routes').then((m) => m.FLIGHT_ROUTES),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('../analytics/analytics.component').then(
            (m) => m.AnalyticsComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('../about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'features',
        loadComponent: () =>
          import('../features/features.component').then(
            (m) => m.FeaturesComponent
          ),
      },
      {
        path: 'support',
        loadComponent: () =>
          import('../support/support.component').then(
            (m) => m.SupportComponent
          ),
      },
    ],
  },
  // Not found route
  {
    path: '404',
    loadComponent: () =>
      import('../not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  // Redirect any unmatched path to the Not Found page
  {
    path: '**',
    redirectTo: '404',
  },
];
