import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Enabling event coalescing improves performance by reducing change detection calls
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
