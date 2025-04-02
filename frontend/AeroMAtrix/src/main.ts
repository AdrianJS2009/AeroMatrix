import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

document.documentElement.style.setProperty('--ripple-effect', 'true');

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
