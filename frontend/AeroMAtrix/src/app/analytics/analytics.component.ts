import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { TooltipItem } from 'chart.js';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '500ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate(
          '500ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'scale(1)' })
        ),
      ]),
    ]),
    trigger('chartAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(
          '600ms 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('tableAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          '500ms 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1 })
        ),
      ]),
    ]),
  ],
  template: `
    <div class="analytics-dashboard" @fadeIn>
      <div class="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Monitor your drone fleet performance and operational metrics</p>
      </div>

      <div class="filter-bar">
        <p-dropdown
          [options]="timeRanges"
          [(ngModel)]="selectedTimeRange"
          optionLabel="label"
          placeholder="Select Time Range"
          (onChange)="updateCharts()"
          styleClass="time-range-dropdown"
        ></p-dropdown>

        <button
          pButton
          label="Refresh Data"
          icon="pi pi-refresh"
          class="p-button-outlined"
          (click)="refreshData()"
        ></button>
      </div>

      <div class="stats-cards">
        <p-card styleClass="stats-card" @cardAnimation>
          <div class="stats-content">
            <div class="stats-icon drone-icon">
              <i class="pi pi-send"></i>
            </div>
            <div class="stats-info">
              <span class="stats-label">Active Drones</span>
              <span class="stats-value">{{ activeCount }}</span>
              <span class="stats-change positive">
                <i class="pi pi-arrow-up"></i> 12% from last month
              </span>
            </div>
          </div>
        </p-card>

        <p-card styleClass="stats-card" @cardAnimation>
          <div class="stats-content">
            <div class="stats-icon flight-icon">
              <i class="pi pi-compass"></i>
            </div>
            <div class="stats-info">
              <span class="stats-label">Total Flights</span>
              <span class="stats-value">{{ flightCount }}</span>
              <span class="stats-change positive">
                <i class="pi pi-arrow-up"></i> 8% from last month
              </span>
            </div>
          </div>
        </p-card>

        <p-card styleClass="stats-card" @cardAnimation>
          <div class="stats-content">
            <div class="stats-icon matrix-icon">
              <i class="pi pi-th-large"></i>
            </div>
            <div class="stats-info">
              <span class="stats-label">Active Matrices</span>
              <span class="stats-value">{{ matrixCount }}</span>
              <span class="stats-change neutral">
                <i class="pi pi-minus"></i> No change
              </span>
            </div>
          </div>
        </p-card>

        <p-card styleClass="stats-card" @cardAnimation>
          <div class="stats-content">
            <div class="stats-icon error-icon">
              <i class="pi pi-exclamation-triangle"></i>
            </div>
            <div class="stats-info">
              <span class="stats-label">Error Rate</span>
              <span class="stats-value">{{ errorRate }}%</span>
              <span class="stats-change negative">
                <i class="pi pi-arrow-down"></i> 5% from last month
              </span>
            </div>
          </div>
        </p-card>
      </div>

      <div class="chart-row">
        <p-card
          header="Flight Activity"
          styleClass="chart-card"
          @chartAnimation
        >
          <p-chart
            type="line"
            [data]="flightActivityData"
            [options]="flightActivityOptions"
          ></p-chart>
        </p-card>

        <p-card
          header="Drone Distribution by Matrix"
          styleClass="chart-card"
          @chartAnimation
        >
          <p-chart
            type="doughnut"
            [data]="droneDistributionData"
            [options]="droneDistributionOptions"
          ></p-chart>
        </p-card>
      </div>

      <div class="chart-row">
        <p-card header="Command Usage" styleClass="chart-card" @chartAnimation>
          <p-chart
            type="bar"
            [data]="commandUsageData"
            [options]="commandUsageOptions"
          ></p-chart>
        </p-card>

        <p-card header="Error Types" styleClass="chart-card" @chartAnimation>
          <p-chart
            type="pie"
            [data]="errorTypesData"
            [options]="errorTypesOptions"
          ></p-chart>
        </p-card>
      </div>

      <p-card
        header="Recent Flight Activity"
        styleClass="table-card"
        @tableAnimation
      >
        <p-table
          [value]="recentFlights"
          [paginator]="true"
          [rows]="5"
          styleClass="p-datatable-sm"
          [rowHover]="true"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Drone</th>
              <th>Matrix</th>
              <th>Commands</th>
              <th>Start Position</th>
              <th>End Position</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-flight>
            <tr>
              <td>{{ flight.drone }}</td>
              <td>{{ flight.matrix }}</td>
              <td>{{ flight.commands }}</td>
              <td>{{ flight.startPosition }}</td>
              <td>{{ flight.endPosition }}</td>
              <td>
                <span
                  class="status-badge"
                  [ngClass]="flight.status.toLowerCase()"
                >
                  {{ flight.status }}
                </span>
              </td>
              <td>{{ flight.time }}</td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: [
    `
      .analytics-dashboard {
        padding: 1.5rem;
      }

      .page-header {
        margin-bottom: 2.5rem;
      }

      .page-header h1 {
        font-size: 2.25rem;
        margin-bottom: 0.75rem;
        color: var(--text-color);
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      .page-header p {
        color: var(--text-color-secondary);
        font-size: 1.1rem;
        max-width: 600px;
      }

      .filter-bar {
        display: flex;
        gap: 1rem;
        margin-bottom: 2.5rem;
        align-items: center;
        flex-wrap: wrap;
        background-color: var(--surface-card);
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-sm);
      }

      .time-range-dropdown {
        min-width: 200px;
      }

      .stats-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2.5rem;
      }

      :host ::ng-deep .stats-card .p-card-body {
        padding: 1.5rem;
      }

      :host ::ng-deep .stats-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
      }

      .stats-content {
        display: flex;
        align-items: center;
        gap: 1.25rem;
      }

      .stats-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        border-radius: 16px;
        font-size: 1.75rem;
        color: white;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
          0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }

      .drone-icon {
        background: linear-gradient(
          135deg,
          var(--primary-500) 0%,
          var(--primary-700) 100%
        );
      }

      .flight-icon {
        background: linear-gradient(
          135deg,
          var(--success-500) 0%,
          var(--success-700) 100%
        );
      }

      .matrix-icon {
        background: linear-gradient(
          135deg,
          var(--warning-500) 0%,
          var(--warning-700) 100%
        );
      }

      .error-icon {
        background: linear-gradient(
          135deg,
          var(--danger-500) 0%,
          var(--danger-700) 100%
        );
      }

      .stats-info {
        display: flex;
        flex-direction: column;
      }

      .stats-label {
        font-size: 0.95rem;
        color: var(--text-color-secondary);
        font-weight: 500;
      }

      .stats-value {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-color);
        margin: 0.35rem 0;
        letter-spacing: -0.02em;
      }

      .stats-change {
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-weight: 500;
      }

      .stats-change.positive {
        color: var(--success-600);
      }

      .stats-change.negative {
        color: var(--danger-600);
      }

      .stats-change.neutral {
        color: var(--text-color-secondary);
      }

      .chart-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2.5rem;
      }

      :host ::ng-deep .chart-card .p-card-body {
        padding: 1.5rem;
      }

      :host ::ng-deep .chart-card .p-card-title {
        font-size: 1.25rem;
        margin-bottom: 1.5rem;
        font-weight: 600;
        color: var(--text-color);
      }

      :host ::ng-deep .chart-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
      }

      :host ::ng-deep .table-card .p-card-body {
        padding: 0;
      }

      :host ::ng-deep .table-card .p-card-content {
        padding: 0;
      }

      :host ::ng-deep .table-card .p-card-title {
        padding: 1.5rem 1.5rem 0.75rem;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .status-badge {
        padding: 0.35rem 0.85rem;
        border-radius: 2rem;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.025em;
      }

      .status-badge.completed {
        background-color: var(--success-100);
        color: var(--success-700);
      }

      .status-badge.in-progress {
        background-color: var(--info-100);
        color: var(--info-700);
      }

      .status-badge.failed {
        background-color: var(--danger-100);
        color: var(--danger-700);
      }

      @media screen and (max-width: 768px) {
        .chart-row {
          grid-template-columns: 1fr;
        }

        .page-header h1 {
          font-size: 1.75rem;
        }

        .stats-value {
          font-size: 1.75rem;
        }

        .stats-icon {
          width: 56px;
          height: 56px;
          font-size: 1.5rem;
        }
      }
    `,
  ],
})
export class AnalyticsComponent implements OnInit {
  // Time range filter
  timeRanges = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'This Year', value: 'year' },
  ];
  selectedTimeRange = this.timeRanges[0];

  // Stats cards data
  activeCount = 12;
  flightCount = 287;
  matrixCount = 5;
  errorRate = 2.4;

  // Chart data
  flightActivityData: any;
  flightActivityOptions: any;

  droneDistributionData: any;
  droneDistributionOptions: any;

  commandUsageData: any;
  commandUsageOptions: any;

  errorTypesData: any;
  errorTypesOptions: any;

  // Table data
  recentFlights = [
    {
      drone: 'Drone #1',
      matrix: 'Matrix 1',
      commands: 'AALRRA',
      startPosition: '(0,0) N',
      endPosition: '(2,2) E',
      status: 'Completed',
      time: '2 hours ago',
    },
    {
      drone: 'Drone #3',
      matrix: 'Matrix 2',
      commands: 'RRAALAA',
      startPosition: '(1,1) W',
      endPosition: '(3,3) N',
      status: 'Completed',
      time: '3 hours ago',
    },
    {
      drone: 'Drone #5',
      matrix: 'Matrix 1',
      commands: 'ALARA',
      startPosition: '(2,2) S',
      endPosition: '(1,3) E',
      status: 'In-Progress',
      time: '5 hours ago',
    },
    {
      drone: 'Drone #2',
      matrix: 'Matrix 3',
      commands: 'AAARRAA',
      startPosition: '(0,0) E',
      endPosition: '(5,0) E',
      status: 'Completed',
      time: '1 day ago',
    },
    {
      drone: 'Drone #7',
      matrix: 'Matrix 2',
      commands: 'RLRLAA',
      startPosition: '(3,3) N',
      endPosition: '(3,5) N',
      status: 'Failed',
      time: '1 day ago',
    },
    {
      drone: 'Drone #4',
      matrix: 'Matrix 1',
      commands: 'AALAARA',
      startPosition: '(1,1) E',
      endPosition: '(4,2) S',
      status: 'Completed',
      time: '2 days ago',
    },
    {
      drone: 'Drone #6',
      matrix: 'Matrix 3',
      commands: 'RLAAALA',
      startPosition: '(2,2) W',
      endPosition: '(0,5) N',
      status: 'Completed',
      time: '3 days ago',
    },
  ];

  ngOnInit() {
    this.initCharts();
  }

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    // Flight Activity Chart
    this.flightActivityData = {
      labels: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      datasets: [
        {
          label: 'Flights',
          data: [28, 35, 42, 31, 45, 62, 44],
          fill: true,
          backgroundColor: documentStyle.getPropertyValue('--primary-100'),
          borderColor: documentStyle.getPropertyValue('--primary-500'),
          tension: 0.4,
          borderWidth: 2,
        },
      ],
    };

    this.flightActivityOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: {
              weight: 500,
            },
          },
        },
        tooltip: {
          backgroundColor: documentStyle.getPropertyValue('--surface-card'),
          titleColor: textColor,
          bodyColor: textColorSecondary,
          borderColor: surfaceBorder,
          borderWidth: 1,
          padding: 10,
          boxPadding: 6,
          usePointStyle: true,
          titleFont: {
            weight: 600,
            size: 14,
          },
          bodyFont: {
            size: 13,
          },
          callbacks: {
            label: (context: TooltipItem<'line'>) => `Flights: ${context.raw}`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart',
      },
    };

    // Drone Distribution Chart
    this.droneDistributionData = {
      labels: ['Matrix 1', 'Matrix 2', 'Matrix 3', 'Matrix 4', 'Matrix 5'],
      datasets: [
        {
          data: [5, 3, 2, 1, 1],
          backgroundColor: [
            documentStyle.getPropertyValue('--primary-500'),
            documentStyle.getPropertyValue('--primary-400'),
            documentStyle.getPropertyValue('--primary-300'),
            documentStyle.getPropertyValue('--primary-200'),
            documentStyle.getPropertyValue('--primary-100'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--primary-600'),
            documentStyle.getPropertyValue('--primary-500'),
            documentStyle.getPropertyValue('--primary-400'),
            documentStyle.getPropertyValue('--primary-300'),
            documentStyle.getPropertyValue('--primary-200'),
          ],
          borderWidth: 0,
        },
      ],
    };

    this.droneDistributionOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: {
              weight: 500,
            },
          },
          position: 'right',
        },
        tooltip: {
          backgroundColor: documentStyle.getPropertyValue('--surface-card'),
          titleColor: textColor,
          bodyColor: textColorSecondary,
          borderColor: surfaceBorder,
          borderWidth: 1,
          padding: 10,
          boxPadding: 6,
          usePointStyle: true,
          titleFont: {
            weight: 600,
            size: 14,
          },
          bodyFont: {
            size: 13,
          },
          callbacks: {
            label: (context: TooltipItem<'line'>) => `Drones: ${context.raw}`,
          },
        },
      },
      cutout: '65%',
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000,
        easing: 'easeOutQuart',
      },
    };

    // Command Usage Chart
    this.commandUsageData = {
      labels: ['Advance (A)', 'Turn Left (L)', 'Turn Right (R)'],
      datasets: [
        {
          label: 'Command Count',
          data: [1250, 820, 940],
          backgroundColor: [
            documentStyle.getPropertyValue('--success-500'),
            documentStyle.getPropertyValue('--info-500'),
            documentStyle.getPropertyValue('--warning-500'),
          ],
          borderColor: [
            documentStyle.getPropertyValue('--success-500'),
            documentStyle.getPropertyValue('--info-500'),
            documentStyle.getPropertyValue('--warning-500'),
          ],
          borderWidth: 0,
          borderRadius: 8,
        },
      ],
    };

    this.commandUsageOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: {
              weight: 500,
            },
          },
        },
        tooltip: {
          backgroundColor: documentStyle.getPropertyValue('--surface-card'),
          titleColor: textColor,
          bodyColor: textColorSecondary,
          borderColor: surfaceBorder,
          borderWidth: 1,
          padding: 10,
          boxPadding: 6,
          usePointStyle: true,
          titleFont: {
            weight: 600,
            size: 14,
          },
          bodyFont: {
            size: 13,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart',
      },
    };

    // Error Types Chart
    this.errorTypesData = {
      labels: [
        'Boundary Violation',
        'Collision Risk',
        'Command Error',
        'Connection Lost',
        'Other',
      ],
      datasets: [
        {
          data: [35, 25, 22, 15, 3],
          backgroundColor: [
            documentStyle.getPropertyValue('--danger-500'),
            documentStyle.getPropertyValue('--warning-500'),
            documentStyle.getPropertyValue('--warning-400'),
            documentStyle.getPropertyValue('--info-500'),
            documentStyle.getPropertyValue('--secondary-400'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--danger-600'),
            documentStyle.getPropertyValue('--warning-600'),
            documentStyle.getPropertyValue('--warning-500'),
            documentStyle.getPropertyValue('--info-600'),
            documentStyle.getPropertyValue('--secondary-500'),
          ],
          borderWidth: 0,
        },
      ],
    };

    this.errorTypesOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: {
              weight: 500,
            },
          },
          position: 'right',
        },
        tooltip: {
          backgroundColor: documentStyle.getPropertyValue('--surface-card'),
          titleColor: textColor,
          bodyColor: textColorSecondary,
          borderColor: surfaceBorder,
          borderWidth: 1,
          padding: 10,
          boxPadding: 6,
          usePointStyle: true,
          titleFont: {
            weight: 600,
            size: 14,
          },
          bodyFont: {
            size: 13,
          },
          callbacks: {
            label: (context: TooltipItem<'line'>) => `Count: ${context.raw}`,
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000,
        easing: 'easeOutQuart',
      },
    };
  }

  updateCharts() {
    // Simulate data update based on selected time range
    if (this.selectedTimeRange.value === '7d') {
      this.activeCount = 12;
      this.flightCount = 287;
      this.errorRate = 2.4;
    } else if (this.selectedTimeRange.value === '30d') {
      this.activeCount = 15;
      this.flightCount = 1124;
      this.errorRate = 3.1;
    } else if (this.selectedTimeRange.value === '90d') {
      this.activeCount = 18;
      this.flightCount = 3542;
      this.errorRate = 2.8;
    } else {
      this.activeCount = 22;
      this.flightCount = 12458;
      this.errorRate = 2.2;
    }

    // Update chart data
    const randomFactor = Math.random() * 0.5 + 0.75;
    this.flightActivityData.datasets[0].data =
      this.flightActivityData.datasets[0].data.map((val: number) =>
        Math.round(val * randomFactor)
      );

    // Force chart update
    this.flightActivityData = { ...this.flightActivityData };
    this.droneDistributionData = { ...this.droneDistributionData };
    this.commandUsageData = { ...this.commandUsageData };
    this.errorTypesData = { ...this.errorTypesData };
  }

  refreshData() {
    this.updateCharts();
  }
}
