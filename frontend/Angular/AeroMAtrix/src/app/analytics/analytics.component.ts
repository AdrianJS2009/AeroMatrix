import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipItem } from 'chart.js';
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
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
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
})
export class AnalyticsComponent implements OnInit {
  // Time range options for the dropdown
  timeRanges = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'This Year', value: 'year' },
  ];
  selectedTimeRange = this.timeRanges[0];

  // Stats variables
  activeCount = 12;
  flightCount = 287;
  matrixCount = 5;
  errorRate = 2.4;

  // Graph data and options
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

  private initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    // Configuration for the flight activity chart
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
            font: { weight: 500 },
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
          titleFont: { weight: 600, size: 14 },
          bodyFont: { size: 13 },
          callbacks: {
            label: (context: TooltipItem<'line'>) => `Flights: ${context.raw}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary, font: { weight: 500 } },
          grid: { color: surfaceBorder, drawBorder: false },
        },
        y: {
          ticks: { color: textColorSecondary, font: { weight: 500 } },
          grid: { color: surfaceBorder, drawBorder: false },
        },
      },
      animation: { duration: 1000, easing: 'easeOutQuart' },
    };

    // Graph configuration for drone distribution
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
          labels: { color: textColor, font: { weight: 500 } },
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
          titleFont: { weight: 600, size: 14 },
          bodyFont: { size: 13 },
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

    // Graph configuration for command usage
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
          labels: { color: textColor, font: { weight: 500 } },
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
          titleFont: { weight: 600, size: 14 },
          bodyFont: { size: 13 },
        },
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary, font: { weight: 500 } },
          grid: { color: surfaceBorder, drawBorder: false },
        },
        y: {
          ticks: { color: textColorSecondary, font: { weight: 500 } },
          grid: { color: surfaceBorder, drawBorder: false },
        },
      },
      animation: { duration: 1000, easing: 'easeOutQuart' },
    };

    // Graph configuration for error types
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
          labels: { color: textColor, font: { weight: 500 } },
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
          titleFont: { weight: 600, size: 14 },
          bodyFont: { size: 13 },
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
    // Update stats based on the selected time range
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

    // Update flight activity data with random values
    const randomFactor = Math.random() * 0.5 + 0.75;
    this.flightActivityData.datasets[0].data =
      this.flightActivityData.datasets[0].data.map((val: number) =>
        Math.round(val * randomFactor)
      );

    // Force chart to re-render
    this.flightActivityData = { ...this.flightActivityData };
    this.droneDistributionData = { ...this.droneDistributionData };
    this.commandUsageData = { ...this.commandUsageData };
    this.errorTypesData = { ...this.errorTypesData };
  }

  refreshData() {
    this.updateCharts();
  }
}
