import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
        <h1>System Settings</h1>
        <p>Configure your drone control system preferences</p>
      </div>

      <p-tabView>
        <!-- General Settings -->
        <p-tabPanel header="General">
          <p-card>
            <div class="settings-section">
              <h2>Application Settings</h2>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="darkMode">Dark Mode</label>
                  <small>Enable dark theme for the application</small>
                </div>
                <p-inputSwitch
                  [(ngModel)]="settings.darkMode"
                  inputId="darkMode"
                ></p-inputSwitch>
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="animations">UI Animations</label>
                  <small>Enable animations throughout the interface</small>
                </div>
                <p-inputSwitch
                  [(ngModel)]="settings.animations"
                  inputId="animations"
                ></p-inputSwitch>
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="language">Language</label>
                  <small>Select your preferred language</small>
                </div>
                <p-dropdown
                  [options]="languageOptions"
                  [(ngModel)]="settings.language"
                  optionLabel="name"
                  styleClass="w-full md:w-14rem"
                ></p-dropdown>
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="notifications">Notifications</label>
                  <small>Enable system notifications</small>
                </div>
                <p-inputSwitch
                  [(ngModel)]="settings.notifications"
                  inputId="notifications"
                ></p-inputSwitch>
              </div>
            </div>

            <p-divider></p-divider>

            <div class="settings-section">
              <h2>Data Display</h2>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="itemsPerPage">Items Per Page</label>
                  <small>Number of items to display in tables</small>
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
                  <label for="dateFormat">Date Format</label>
                  <small>Select your preferred date format</small>
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
                label="Reset to Defaults"
                icon="pi pi-refresh"
                class="p-button-outlined p-button-secondary"
                (click)="resetGeneralSettings()"
              ></button>
              <button
                pButton
                label="Save Changes"
                icon="pi pi-check"
                (click)="saveSettings('general')"
              ></button>
            </div>
          </p-card>
        </p-tabPanel>

        <!-- Drone Settings -->
        <p-tabPanel header="Drone Control">
          <p-card>
            <div class="settings-section">
              <h2>Default Drone Settings</h2>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="defaultOrientation">Default Orientation</label>
                  <small>Initial orientation for new drones</small>
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
                  <label for="autoPosition">Auto-Position</label>
                  <small
                    >Automatically position new drones at matrix origin</small
                  >
                </div>
                <p-inputSwitch
                  [(ngModel)]="settings.autoPosition"
                  inputId="autoPosition"
                ></p-inputSwitch>
              </div>
            </div>

            <p-divider></p-divider>

            <div class="settings-section">
              <h2>Flight Controls</h2>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="confirmCommands">Confirm Commands</label>
                  <small
                    >Show confirmation dialog before executing flight
                    commands</small
                  >
                </div>
                <p-inputSwitch
                  [(ngModel)]="settings.confirmCommands"
                  inputId="confirmCommands"
                ></p-inputSwitch>
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="commandDelay">Command Execution Delay (ms)</label>
                  <small
                    >Delay between command executions for visualization</small
                  >
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
                  <label for="boundaryCheck">Boundary Checking</label>
                  <small
                    >Prevent drones from moving outside matrix boundaries</small
                  >
                </div>
                <p-inputSwitch
                  [(ngModel)]="settings.boundaryCheck"
                  inputId="boundaryCheck"
                ></p-inputSwitch>
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="collisionDetection">Collision Detection</label>
                  <small>Prevent drones from occupying the same position</small>
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
                label="Reset to Defaults"
                icon="pi pi-refresh"
                class="p-button-outlined p-button-secondary"
                (click)="resetDroneSettings()"
              ></button>
              <button
                pButton
                label="Save Changes"
                icon="pi pi-check"
                (click)="saveSettings('drone')"
              ></button>
            </div>
          </p-card>
        </p-tabPanel>

        <!-- API Settings -->
        <p-tabPanel header="API Configuration">
          <p-card>
            <div class="settings-section">
              <h2>API Connection</h2>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="apiUrl">API URL</label>
                  <small>Base URL for the drone control API</small>
                </div>
                <input
                  pInputText
                  [(ngModel)]="settings.apiUrl"
                  class="w-full md:w-30rem"
                />
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="apiTimeout">Request Timeout (ms)</label>
                  <small>Maximum time to wait for API responses</small>
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
                  <label for="retryAttempts">Retry Attempts</label>
                  <small>Number of times to retry failed API requests</small>
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
              <h2>Authentication</h2>

              <div class="setting-item">
                <div class="setting-label">
                  <label for="apiKey">API Key</label>
                  <small>Authentication key for API access</small>
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
                  <label for="tokenRefresh">Auto Token Refresh</label>
                  <small>Automatically refresh authentication tokens</small>
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
                label="Test Connection"
                icon="pi pi-link"
                class="p-button-outlined"
                (click)="testApiConnection()"
              ></button>
              <button
                pButton
                label="Reset to Defaults"
                icon="pi pi-refresh"
                class="p-button-outlined p-button-secondary"
                (click)="resetApiSettings()"
              ></button>
              <button
                pButton
                label="Save Changes"
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
  languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'pt', name: 'Portuguese' },
  ];

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

  constructor(private readonly messageService: MessageService) {}

  saveSettings(section: string) {
    // In a real app, this would save to a service or backend
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
    this.settings.animations = true;
    this.settings.language = { code: 'en', name: 'English' };
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
