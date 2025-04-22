import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  image: string;
  tag: string;
  tagSeverity:
    | 'success'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast'
    | undefined;
}

export interface FeatureCategory {
  name: string;
  icon: string;
  features: Feature[];
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TabViewModule,
    ButtonModule,
    AccordionModule,
    DividerModule,
    TagModule,
    TranslateModule,
  ],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '0.5s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('staggered', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(
          '0.5s {{delay}}ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class FeaturesComponent implements OnInit {
  featureCategories: FeatureCategory[] = [];

  ngOnInit() {
    // Initialize feature categories with dummy data
    this.featureCategories = [
      {
        name: 'Drone Management',
        icon: 'pi-paper-plane',
        features: [
          {
            id: 'drone-registry',
            title: 'Drone Registry',
            description:
              'Comprehensive drone inventory management with detailed specifications and maintenance records.',
            icon: 'pi-list',
            benefits: [
              'Centralized drone fleet inventory',
              'Automatic maintenance scheduling',
              'Compliance documentation storage',
              'Equipment lifecycle tracking',
            ],
            image: 'assets/images/features/drone-registry.jpg',
            tag: 'Core',
            tagSeverity: 'info',
          },
          {
            id: 'health-monitoring',
            title: 'Health Monitoring',
            description:
              'Real-time monitoring of drone health metrics and component status for preventive maintenance.',
            icon: 'pi-heart',
            benefits: [
              'Predictive maintenance alerts',
              'Component lifespan tracking',
              'Failure risk assessment',
              'Maintenance history logging',
            ],
            image: 'assets/images/features/health-monitoring.jpg',
            tag: 'Advanced',
            tagSeverity: 'success',
          },
          {
            id: 'firmware-updates',
            title: 'Firmware Management',
            description:
              'Streamlined firmware update process with version control and rollback capabilities.',
            icon: 'pi-refresh',
            benefits: [
              'Over-the-air updates',
              'Update scheduling',
              'Version compatibility checking',
              'Batch update deployment',
            ],
            image: 'assets/images/features/firmware-updates.jpg',
            tag: 'Technical',
            tagSeverity: 'warning',
          },
        ],
      },
      {
        name: 'Matrix Control',
        icon: 'pi-th-large',
        features: [
          {
            id: 'matrix-creation',
            title: 'Matrix Creation',
            description:
              'Intuitive tools for defining and configuring drone matrices for coordinated operations.',
            icon: 'pi-plus-circle',
            benefits: [
              'Drag-and-drop matrix builder',
              'Template-based configurations',
              'Custom formation patterns',
              'Simulation preview',
            ],
            image: 'assets/images/features/matrix-creation.jpg',
            tag: 'Core',
            tagSeverity: 'info',
          },
          {
            id: 'formation-control',
            title: 'Formation Control',
            description:
              'Advanced algorithms for maintaining precise drone formations during flight operations.',
            icon: 'pi-sitemap',
            benefits: [
              'Dynamic formation adjustments',
              'Obstacle avoidance while in formation',
              'Formation transition animations',
              'Position error correction',
            ],
            image: 'assets/images/features/formation-control.jpg',
            tag: 'Advanced',
            tagSeverity: 'success',
          },
          {
            id: '3d-visualization',
            title: '3D Visualization',
            description:
              'Immersive 3D visualization of drone matrices for intuitive monitoring and control.',
            icon: 'pi-cube',
            benefits: [
              'Real-time 3D rendering',
              'Multiple viewing perspectives',
              'Telemetry data overlay',
              'Recording and playback',
            ],
            image: 'assets/images/features/3d-visualization.jpg',
            tag: 'Premium',
            tagSeverity: 'danger',
          },
        ],
      },
      {
        name: 'Flight Control',
        icon: 'pi-sliders-h',
        features: [
          {
            id: 'mission-planning',
            title: 'Mission Planning',
            description:
              'Comprehensive mission planning tools with waypoint navigation and task scheduling.',
            icon: 'pi-map',
            benefits: [
              'Waypoint route creation',
              'Task assignment at waypoints',
              'Time and energy optimization',
              'Regulatory compliance checking',
            ],
            image: 'assets/images/features/mission-planning.jpg',
            tag: 'Core',
            tagSeverity: 'info',
          },
          {
            id: 'autonomous-flight',
            title: 'Autonomous Flight',
            description:
              'Fully autonomous flight capabilities with intelligent decision-making and adaptability.',
            icon: 'pi-cog',
            benefits: [
              'Autonomous takeoff and landing',
              'Dynamic route adjustment',
              'Environmental awareness',
              'Fail-safe protocols',
            ],
            image: 'assets/images/features/autonomous-flight.jpg',
            tag: 'Advanced',
            tagSeverity: 'success',
          },
          {
            id: 'batch-commands',
            title: 'Batch Commands',
            description:
              'Efficient batch command system for coordinating multiple drones simultaneously.',
            icon: 'pi-send',
            benefits: [
              'Synchronized operations',
              'Command sequencing',
              'Conditional execution',
              'Batch abort and recovery',
            ],
            image: 'assets/images/features/batch-commands.jpg',
            tag: 'Technical',
            tagSeverity: 'warning',
          },
        ],
      },
      {
        name: 'Analytics',
        icon: 'pi-chart-bar',
        features: [
          {
            id: 'flight-analytics',
            title: 'Flight Analytics',
            description:
              'Comprehensive analytics on flight performance, efficiency, and operational metrics.',
            icon: 'pi-chart-line',
            benefits: [
              'Flight efficiency scoring',
              'Comparative performance analysis',
              'Trend identification',
              'Custom report generation',
            ],
            image: 'assets/images/features/flight-analytics.jpg',
            tag: 'Core',
            tagSeverity: 'info',
          },
          {
            id: 'telemetry-insights',
            title: 'Telemetry Insights',
            description:
              'Deep analysis of telemetry data to optimize drone performance and identify issues.',
            icon: 'pi-chart-bar',
            benefits: [
              'Anomaly detection',
              'Performance optimization suggestions',
              'Component stress analysis',
              'Environmental impact assessment',
            ],
            image: 'assets/images/features/telemetry-insights.jpg',
            tag: 'Advanced',
            tagSeverity: 'success',
          },
          {
            id: 'operational-dashboard',
            title: 'Operational Dashboard',
            description:
              'Customizable dashboards providing real-time overview of all drone operations.',
            icon: 'pi-tablet',
            benefits: [
              'Real-time fleet status',
              'Key performance indicators',
              'Alert monitoring',
              'Resource utilization tracking',
            ],
            image: 'assets/images/features/operational-dashboard.jpg',
            tag: 'Premium',
            tagSeverity: 'danger',
          },
        ],
      },
    ];
  }

  trackCategory(index: number, category: FeatureCategory): string {
    return category.name;
  }

  trackFeature(index: number, feature: Feature): string {
    return feature.id;
  }

  trackBenefit(index: number, benefit: string): string {
    return benefit;
  }
}
