import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';

interface Feature {
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

interface FeatureCategory {
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
  template: `
    <div class="features-container p-4">
      <div class="grid">
        <!-- Hero Section -->
        <div class="col-12" @fadeIn>
          <p-card styleClass="mb-4 hero-card">
            <div class="flex flex-column md:flex-row align-items-center">
              <div class="md:w-7 p-4">
                <h1 class="text-4xl font-bold mb-4">Powerful Features</h1>
                <p class="text-xl line-height-3 mb-4">
                  Discover the comprehensive suite of tools and capabilities
                  that make DroneMatrix the leading solution for drone fleet
                  management.
                </p>
                <p class="mb-4">
                  Our platform combines intuitive interfaces with powerful
                  backend systems to give you complete control over your drone
                  operations.
                </p>
              </div>
              <div class="md:w-5 flex justify-content-center">
                <img
                  src="assets/images/features-hero.svg"
                  alt="Features Overview"
                  class="w-full max-w-25rem"
                />
              </div>
            </div>
          </p-card>
        </div>

        <!-- Feature Categories -->
        <div class="col-12">
          <p-tabView>
            @for (category of featureCategories; track category.name) {
            <p-tabPanel
              [header]="category.name"
              [leftIcon]="'pi ' + category.icon"
            >
              <div class="grid">
                @for (feature of category.features; track feature.id; let i =
                $index) {
                <div
                  class="col-12 md:col-6 lg:col-4 mb-4"
                  @staggered
                  [attr.data-animation-params]="{ delay: i * 100 }"
                >
                  <p-card styleClass="h-full feature-card">
                    <ng-template pTemplate="header">
                      <div
                        class="feature-header p-3 flex align-items-center justify-content-between"
                      >
                        <div class="flex align-items-center">
                          <i
                            [class]="'pi ' + feature.icon + ' text-2xl mr-2'"
                          ></i>
                          <h3 class="m-0">{{ feature.title }}</h3>
                        </div>
                        <p-tag
                          [value]="feature.tag"
                          [severity]="feature.tagSeverity"
                        ></p-tag>
                      </div>
                    </ng-template>
                    <div class="feature-image-container mb-3">
                      <img
                        [src]="feature.image"
                        [alt]="feature.title"
                        class="w-full feature-image"
                      />
                    </div>
                    <p class="line-height-3 mb-3">{{ feature.description }}</p>
                    <p-divider></p-divider>
                    <h4>Key Benefits</h4>
                    <ul class="pl-3 line-height-3">
                      @for (benefit of feature.benefits; track benefit) {
                      <li class="mb-2">{{ benefit }}</li>
                      }
                    </ul>
                    <div class="mt-4 flex justify-content-end">
                      <p-button
                        label="Learn More"
                        icon="pi pi-arrow-right"
                        styleClass="p-button-text"
                      ></p-button>
                    </div>
                  </p-card>
                </div>
                }
              </div>
            </p-tabPanel>
            }
          </p-tabView>
        </div>

        <!-- Integration Section -->
        <div class="col-12" @fadeIn>
          <p-card header="Seamless Integrations" styleClass="mb-4">
            <div class="grid">
              <div
                class="col-12 md:col-6 flex flex-column justify-content-center"
              >
                <h3 class="mb-3">Connect with Your Existing Systems</h3>
                <p class="line-height-3 mb-3">
                  DroneMatrix is designed to work with your existing
                  infrastructure and tools. Our robust API and integration
                  capabilities ensure smooth data flow between systems.
                </p>
                <p-accordion>
                  <p-accordionTab header="Enterprise Systems">
                    <p class="line-height-3">
                      Connect with ERP, CRM, and asset management systems to
                      maintain a single source of truth for your organization's
                      data.
                    </p>
                  </p-accordionTab>
                  <p-accordionTab header="Data Analytics Platforms">
                    <p class="line-height-3">
                      Export flight data and telemetry to your analytics
                      platforms for deeper insights and business intelligence.
                    </p>
                  </p-accordionTab>
                  <p-accordionTab header="Third-Party Drone Hardware">
                    <p class="line-height-3">
                      Our system supports a wide range of drone manufacturers
                      and models, allowing you to manage mixed fleets with ease.
                    </p>
                  </p-accordionTab>
                </p-accordion>
              </div>
              <div
                class="col-12 md:col-6 flex justify-content-center align-items-center"
              >
                <img
                  src="assets/images/integration.svg"
                  alt="System Integrations"
                  class="w-full max-w-20rem"
                />
              </div>
            </div>
          </p-card>
        </div>

        <!-- Call to Action -->
        <div class="col-12" @fadeIn>
          <p-card styleClass="mb-4 cta-card">
            <div class="flex flex-column align-items-center text-center p-4">
              <h2 class="text-3xl font-bold mb-3">
                Ready to Transform Your Drone Operations?
              </h2>
              <p class="text-xl line-height-3 mb-4 max-w-30rem">
                Experience the full power of DroneMatrix with a personalized
                demo tailored to your specific needs.
              </p>
              <div class="flex gap-3">
                <p-button
                  label="Request Demo"
                  icon="pi pi-play"
                  styleClass="p-button-lg"
                ></p-button>
                <p-button
                  label="Contact Sales"
                  icon="pi pi-envelope"
                  styleClass="p-button-outlined p-button-lg"
                ></p-button>
              </div>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .hero-card {
        background: linear-gradient(
          135deg,
          var(--surface-ground) 0%,
          var(--surface-card) 100%
        );
      }

      .feature-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      }

      .feature-header {
        background-color: var(--surface-ground);
      }

      .feature-image-container {
        height: 160px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .feature-image {
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .feature-card:hover .feature-image {
        transform: scale(1.05);
      }

      .cta-card {
        background: linear-gradient(
          135deg,
          var(--primary-color) 0%,
          var(--primary-700) 100%
        );
        color: white;
      }

      :host ::ng-deep .cta-card .p-card-content {
        color: white;
      }

      :host ::ng-deep .p-tabview .p-tabview-nav {
        justify-content: center;
        margin-bottom: 2rem;
      }

      :host ::ng-deep .p-tabview .p-tabview-nav li .p-tabview-nav-link {
        padding: 1rem 1.5rem;
      }
    `,
  ],
})
export class FeaturesComponent implements OnInit {
  featureCategories: FeatureCategory[] = [];

  ngOnInit() {
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
}
