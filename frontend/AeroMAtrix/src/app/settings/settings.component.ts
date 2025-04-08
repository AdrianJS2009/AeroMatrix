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
  template: `
    <div class="settings-container" @fadeIn>
      <div class="page-header">
        <h1>{{ 'SETTINGS.TITLE' | translate }}</h1>
        <p>{{ 'SETTINGS.SUBTITLE' | translate }}</p>
      </div>

      <p-tabView>
        <!-- General Settings -->
        <p-tabPanel [header]="'SETTINGS.GENERAL.TITLE' | translate">
          <p-card>
            <div class="settings-section">
              <h2>{{ 'SETTINGS.GENERAL.APP_SETTINGS' | translate }}</h2>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="darkMode">{{
                    'SETTINGS.GENERAL.DARK_MODE' | translate
                  }}</label>
                  <small>{{
                    'SETTINGS.GENERAL.DARK_MODE_DESC' | translate
                  }}</small>
                </div>
                <p-inputSwitch
                  [(ngModel)]="settings.darkMode"
                  inputId="darkMode"
                  (onChange)="onThemeChange()"
                ></p-inputSwitch>
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="animations">{{
                    'SETTINGS.GENERAL.ANIMATIONS' | translate
                  }}</label>
                  <small>{{
                    'SETTINGS.GENERAL.ANIMATIONS_DESC' | translate
                  }}</small>
                </div>
                <p-inputSwitch
                  [(ngModel)]="settings.animations"
                  inputId="animations"
                ></p-inputSwitch>
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="language">{{
                    'SETTINGS.GENERAL.LANGUAGE' | translate
                  }}</label>
                  <small>{{
                    'SETTINGS.GENERAL.LANGUAGE_DESC' | translate
                  }}</small>
                </div>
                <p-dropdown
                  [options]="languageOptions"
                  [(ngModel)]="settings.language"
                  optionLabel="name"
                  styleClass="w-full md:w-14rem"
                  (onChange)="onLanguageChange()"
                ></p-dropdown>
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="notifications">{{
                    'SETTINGS.GENERAL.NOTIFICATIONS' | translate
                  }}</label>
                  <small>{{
                    'SETTINGS.GENERAL.NOTIFICATIONS_DESC' | translate
                  }}</small>
                </div>
                <p-inputSwitch
                  [(ngModel)]="settings.notifications"
                  inputId="notifications"
                ></p-inputSwitch>
              </div>
            </div>

            <p-divider></p-divider>

            <div class="settings-section">
              <h2>{{ 'SETTINGS.GENERAL.DATA_DISPLAY' | translate }}</h2>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="itemsPerPage">{{
                    'SETTINGS.GENERAL.ITEMS_PER_PAGE' | translate
                  }}</label>
                  <small>{{
                    'SETTINGS.GENERAL.ITEMS_PER_PAGE_DESC' | translate
                  }}</small>
                </div>
                <p-inputNumber
                  [(ngModel)]="settings.itemsPerPage"
                  [showButtons]="true"
                  [min]="5"
                  [max]="100"
                  [step]="5"
                  styleClass="w-full md:w-14rem"
                ></p-inputNumber>
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="dateFormat">{{
                    'SETTINGS.GENERAL.DATE_FORMAT' | translate
                  }}</label>
                  <small>{{
                    'SETTINGS.GENERAL.DATE_FORMAT_DESC' | translate
                  }}</small>
                </div>
                <p-dropdown
                  [options]="dateFormatOptions"
                  [(ngModel)]="settings.dateFormat"
                  optionLabel="label"
                  styleClass="w-full md:w-14rem"
                ></p-dropdown>
              </div>
            </div>

            <div class="settings-actions">
              <button
                pButton
                label="{{ 'SETTINGS.ACTIONS.RESET' | translate }}"
                icon="pi pi-refresh"
                class="p-button-outlined p-button-secondary"
                (click)="resetGeneralSettings()"
              ></button>
              <button
                pButton
                label="{{ 'SETTINGS.ACTIONS.SAVE' | translate }}"
                icon="pi pi-check"
                (click)="saveSettings('general')"
              ></button>
            </div>
          </p-card>
        </p-tabPanel>

        <!-- Drone Settings -->
        <p-tabPanel [header]="'SETTINGS.DRONE.TITLE' | translate">
          <p-card>
            <div class="settings-section">
              <h2>{{ 'SETTINGS.DRONE.DEFAULT_SETTINGS' | translate }}</h2>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="defaultOrientation">{{
                    'SETTINGS.DRONE.DEFAULT_ORIENTATION' | translate
                  }}</label>
                  <small>{{
                    'SETTINGS.DRONE.DEFAULT_ORIENTATION_DESC' | translate
                  }}</small>
                </div>
                <p-dropdown
                  [options]="orientationOptions"
                  [(ngModel)]="settings.defaultOrientation"
                  optionLabel="label"
                  styleClass="w-full md:w-14rem"
                ></p-dropdown>
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="autoPosition">{{
                    'SETTINGS.DRONE.AUTO_POSITION' | translate
                  }}</label>
                  <small>{{
                    'SETTINGS.DRONE.AUTO_POSITION_DESC' | translate
                  }}</small>
                </div>
                <p-inputSwitch
                  [(ngModel)]="settings.autoPosition"
                  inputId="autoPosition"
                ></p-inputSwitch>
              </div>
            </div>

            <p-divider></p-divider>

            <div class="settings-section">
              <h2>{{ 'SETTINGS.DRONE.FLIGHT_CONTROLS' | translate }}</h2>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="confirmCommands">{{
                    'SETTINGS.DRONE.CONFIRM_COMMANDS' | translate
                  }}</label>
                  <small>{{
                    'SETTINGS.DRONE.CONFIRM_COMMANDS_DESC' | translate
                  }}</small>
                </div>
                <p-inputSwitch
                  [(ngModel)]="settings.confirmCommands"
                  inputId="confirmCommands"
                ></p-inputSwitch>
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="commandDelay">{{
                    'SETTINGS.DRONE.COMMAND_DELAY' | translate
                  }}</label>
                  <small>{{
                    'SETTINGS.DRONE.COMMAND_DELAY_DESC' | translate
                  }}</small>
                </div>
                <p-inputNumber
                  [(ngModel)]="settings.commandDelay"
                  [showButtons]="true"
                  [min]="0"
                  [max]="2000"
                  [step]="100"
                  styleClass="w-full md:w-14rem"
                ></p-inputNumber>
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="boundaryCheck">{{
                    'SETTINGS.DRONE.BOUNDARY_CHECK' | translate
                  }}</label>
                  <small>{{
                    'SETTINGS.DRONE.BOUNDARY_CHECK_DESC' | translate
                  }}</small>
                </div>
                <p-inputSwitch
                  [(ngModel)]="settings.boundaryCheck"
                  inputId="boundaryCheck"
                ></p-inputSwitch>
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="collisionDetection">{{
                    'SETTINGS.DRONE.COLLISION_DETECTION' | translate
                  }}</label>
                  <small>{{
                    'SETTINGS.DRONE.COLLISION_DETECTION_DESC' | translate
                  }}</small>
                </div>
                <p-inputSwitch
                  [(ngModel)]="settings.collisionDetection"
                  inputId="collisionDetection"
                ></p-inputSwitch>
              </div>
            </div>

            <div class="settings-actions">
              <button
                pButton
                label="{{ 'SETTINGS.ACTIONS.RESET' | translate }}"
                icon="pi pi-refresh"
                class="p-button-outlined p-button-secondary"
                (click)="resetDroneSettings()"
              ></button>
              <button
                pButton
                label="{{ 'SETTINGS.ACTIONS.SAVE' | translate }}"
                icon="pi pi-check"
                (click)="saveSettings('drone')"
              ></button>
            </div>
          </p-card>
        </p-tabPanel>

        <!-- API Settings -->
        <p-tabPanel [header]="'SETTINGS.API.TITLE' | translate">
          <p-card>
            <div class="settings-section">
              <h2>{{ 'SETTINGS.API.CONNECTION' | translate }}</h2>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="apiUrl">{{
                    'SETTINGS.API.API_URL' | translate
                  }}</label>
                  <small>{{ 'SETTINGS.API.API_URL_DESC' | translate }}</small>
                </div>
                <input
                  pInputText
                  [(ngModel)]="settings.apiUrl"
                  class="w-full md:w-30rem"
                />
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="apiTimeout">{{
                    'SETTINGS.API.REQUEST_TIMEOUT' | translate
                  }}</label>
                  <small>{{
                    'SETTINGS.API.REQUEST_TIMEOUT_DESC' | translate
                  }}</small>
                </div>
                <p-inputNumber
                  [(ngModel)]="settings.apiTimeout"
                  [showButtons]="true"
                  [min]="1000"
                  [max]="30000"
                  [step]="1000"
                  styleClass="w-full md:w-14rem"
                ></p-inputNumber>
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="retryAttempts">{{
                    'SETTINGS.API.RETRY_ATTEMPTS' | translate
                  }}</label>
                  <small>{{
                    'SETTINGS.API.RETRY_ATTEMPTS_DESC' | translate
                  }}</small>
                </div>
                <p-inputNumber
                  [(ngModel)]="settings.retryAttempts"
                  [showButtons]="true"
                  [min]="0"
                  [max]="5"
                  [step]="1"
                  styleClass="w-full md:w-14rem"
                ></p-inputNumber>
              </div>
            </div>

            <p-divider></p-divider>

            <div class="settings-section">
              <h2>{{ 'SETTINGS.API.AUTHENTICATION' | translate }}</h2>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="apiKey">{{
                    'SETTINGS.API.API_KEY' | translate
                  }}</label>
                  <small>{{ 'SETTINGS.API.API_KEY_DESC' | translate }}</small>
                </div>
                <input
                  pInputText
                  [(ngModel)]="settings.apiKey"
                  type="password"
                  class="w-full md:w-30rem"
                />
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="tokenRefresh">{{
                    'SETTINGS.API.TOKEN_REFRESH' | translate
                  }}</label>
                  <small>{{
                    'SETTINGS.API.TOKEN_REFRESH_DESC' | translate
                  }}</small>
                </div>
                <p-inputSwitch
                  [(ngModel)]="settings.tokenRefresh"
                  inputId="tokenRefresh"
                ></p-inputSwitch>
              </div>
            </div>

            <div class="settings-actions">
              <button
                pButton
                label="{{ 'SETTINGS.ACTIONS.TEST_CONNECTION' | translate }}"
                icon="pi pi-link"
                class="p-button-outlined"
                (click)="testApiConnection()"
              ></button>
              <button
                pButton
                label="{{ 'SETTINGS.ACTIONS.RESET' | translate }}"
                icon="pi pi-refresh"
                class="p-button-outlined p-button-secondary"
                (click)="resetApiSettings()"
              ></button>
              <button
                pButton
                label="{{ 'SETTINGS.ACTIONS.SAVE' | translate }}"
                icon="pi pi-check"
                (click)="saveSettings('api')"
              ></button>
            </div>
          </p-card>
        </p-tabPanel>
      </p-tabView>
    </div>

    <p-toast></p-toast>
  `,
  styles: [
    `
      .settings-container {
        padding: 1rem;
      }

      .page-header {
        margin-bottom: 2rem;
      }

      .page-header h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        color: var(--text-color);
      }

      .page-header p {
        color: var(--text-color-secondary);
        font-size: 1.1rem;
      }

      .settings-section {
        margin-bottom: 2rem;
      }

      .settings-section h2 {
        font-size: 1.25rem;
        margin-bottom: 1.5rem;
        color: var(--text-color);
      }

      .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .setting-label {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 200px;
      }

      .setting-label label {
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: var(--text-color);
      }

      .setting-label small {
        color: var(--text-color-secondary);
      }

      .settings-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
      }

      @media screen and (max-width: 768px) {
        .setting-item {
          flex-direction: column;
          align-items: flex-start;
        }

        .settings-actions {
          flex-direction: column;
        }

        .settings-actions button {
          width: 100%;
        }
      }
    `,
  ],
})
export class SettingsComponent {
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
    // Initialize language options
    this.languageOptions = this.translationService.availableLanguages;

    // Initialize settings from services
    this.themeService.currentTheme$.subscribe((theme) => {
      this.settings.darkMode = theme === 'dark';
    });

    this.translationService.currentLanguage$.subscribe((language) => {
      this.settings.language = language;
    });
  }

  onThemeChange() {
    const theme: Theme = this.settings.darkMode ? 'dark' : 'light';
    this.themeService.setTheme(theme);
  }

  onLanguageChange() {
    this.translationService.setLanguage(this.settings.language);
  }

  saveSettings(section: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Settings Saved',
      detail: `${
        section.charAt(0).toUpperCase() + section.slice(1)
      } settings have been updated successfully.`,
      life: 3000,
    });
  }

  resetGeneralSettings() {
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

  resetDroneSettings() {
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

  resetApiSettings() {
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

  testApiConnection() {
    // Simulate API connection test
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
