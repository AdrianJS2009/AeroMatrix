import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

import { Theme, ThemeService } from '../core/services/theme.service';
import {
  Language,
  TranslationService,
} from '../core/services/translation.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TabViewModule,
    InputSwitchModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    DividerModule,
    InputNumberModule,
    ToastModule,
    TranslateModule,
  ],
  providers: [MessageService],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class SettingsComponent {
  // Settings object stores all app settings
  settings = {
    // General settings
    darkMode: false,
    animations: true,
    language: { code: 'en', name: 'English' },
    notifications: true,
    itemsPerPage: 10,
    dateFormat: { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },

    // Drone settings
    defaultOrientation: { value: 'N', label: 'North (N)' },
    autoPosition: true,
    confirmCommands: true,
    commandDelay: 500,
    boundaryCheck: true,
    collisionDetection: true,

    // API settings
    apiUrl: 'http://localhost:8080/api',
    apiTimeout: 5000,
    retryAttempts: 3,
    apiKey: 'your-api-key-here',
    tokenRefresh: true,
  };

  // Dropdown options
  languageOptions: Language[] = [];
  dateFormatOptions = [
    { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
    { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
    { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
    { value: 'dd-MMM-yyyy', label: 'DD-MMM-YYYY' },
  ];
  orientationOptions = [
    { value: 'N', label: 'North (N)' },
    { value: 'S', label: 'South (S)' },
    { value: 'E', label: 'East (E)' },
    { value: 'W', label: 'West (W)' },
  ];

  constructor(
    private readonly messageService: MessageService,
    private readonly themeService: ThemeService,
    private readonly translationService: TranslationService
  ) {
    // Initialize language options from translation service
    this.languageOptions = this.translationService.availableLanguages;

    // Subscribe to theme changes and update settings accordingly
    this.themeService.currentTheme$.subscribe((theme) => {
      this.settings.darkMode = theme === 'dark';
    });

    // Subscribe to language changes and update settings accordingly
    this.translationService.currentLanguage$.subscribe((language) => {
      this.settings.language = language;
    });
  }

  /** Update the theme based on the darkMode setting */
  onThemeChange(): void {
    const theme: Theme = this.settings.darkMode ? 'dark' : 'light';
    this.themeService.setTheme(theme);
  }

  /** Update the current language setting */
  onLanguageChange(): void {
    this.translationService.setLanguage(this.settings.language);
  }

  /** Simulate save action and show a success message for the specified section */
  saveSettings(section: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Settings Saved',
      detail: `${
        section.charAt(0).toUpperCase() + section.slice(1)
      } settings have been updated successfully.`,
      life: 3000,
    });
  }

  /** Reset general settings to default values */
  resetGeneralSettings(): void {
    this.settings.darkMode = false;
    this.themeService.setTheme('light');

    this.settings.animations = true;
    this.settings.language = { code: 'en', name: 'English' };
    this.translationService.setLanguage(this.settings.language);

    this.settings.notifications = true;
    this.settings.itemsPerPage = 10;
    this.settings.dateFormat = { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' };

    this.messageService.add({
      severity: 'info',
      summary: 'Settings Reset',
      detail: 'General settings have been reset to defaults.',
      life: 3000,
    });
  }

  /** Reset drone-related settings to default values */
  resetDroneSettings(): void {
    this.settings.defaultOrientation = { value: 'N', label: 'North (N)' };
    this.settings.autoPosition = true;
    this.settings.confirmCommands = true;
    this.settings.commandDelay = 500;
    this.settings.boundaryCheck = true;
    this.settings.collisionDetection = true;

    this.messageService.add({
      severity: 'info',
      summary: 'Settings Reset',
      detail: 'Drone control settings have been reset to defaults.',
      life: 3000,
    });
  }

  /** Reset API settings to default values */
  resetApiSettings(): void {
    this.settings.apiUrl = 'http://localhost:8080/api';
    this.settings.apiTimeout = 5000;
    this.settings.retryAttempts = 3;
    this.settings.apiKey = '';
    this.settings.tokenRefresh = true;

    this.messageService.add({
      severity: 'info',
      summary: 'Settings Reset',
      detail: 'API configuration has been reset to defaults.',
      life: 3000,
    });
  }

  testApiConnection(): void {
    // Simulate API connection test delay
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Connection Successful',
        detail: 'API connection test completed successfully.',
        life: 3000,
      });
    }, 1500);
  }
}
