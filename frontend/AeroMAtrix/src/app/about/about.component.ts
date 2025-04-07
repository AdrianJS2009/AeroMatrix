import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TimelineModule,
    DividerModule,
    AvatarModule,
    AvatarGroupModule,
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
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate(
          '0.5s 0.2s ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
  ],
  template: `
    <div class="about-container p-4">
      <div class="grid">
        <!-- Hero Section -->
        <div class="col-12" @fadeIn>
          <p-card styleClass="mb-4 hero-card">
            <div class="flex flex-column md:flex-row align-items-center">
              <div class="md:w-7 p-4">
                <h1 class="text-4xl font-bold mb-4">
                  DroneMatrix Control Systems
                </h1>
                <p class="text-xl line-height-3 mb-4">
                  Pioneering the future of drone fleet management with advanced
                  matrix-based control systems.
                </p>
                <p class="mb-4">
                  Our mission is to revolutionize how organizations manage and
                  operate drone fleets through innovative technology, intuitive
                  interfaces, and powerful control systems.
                </p>
                <div class="flex flex-wrap gap-2">
                  <p-button
                    label="Our Technology"
                    icon="pi pi-cog"
                    styleClass="p-button-outlined"
                  ></p-button>
                  <p-button label="Contact Us" icon="pi pi-envelope"></p-button>
                </div>
              </div>
              <div class="md:w-5 flex justify-content-center">
                <img
                  src="assets/images/drone-hero.svg"
                  alt="Drone Control System"
                  class="w-full max-w-25rem"
                />
              </div>
            </div>
          </p-card>
        </div>

        <!-- Mission & Vision -->
        <div class="col-12 md:col-6" @slideIn>
          <p-card header="Our Mission" styleClass="mb-4 h-full">
            <p class="line-height-3">
              To empower organizations with cutting-edge drone management
              solutions that enhance operational efficiency, safety, and
              data-driven decision making.
            </p>
            <p class="line-height-3 mt-3">
              We strive to be at the forefront of drone technology innovation,
              creating systems that are powerful yet intuitive, complex yet
              accessible.
            </p>
            <div class="mt-4 flex justify-content-center">
              <i class="pi pi-compass text-6xl text-primary"></i>
            </div>
          </p-card>
        </div>

        <div class="col-12 md:col-6" @slideIn>
          <p-card header="Our Vision" styleClass="mb-4 h-full">
            <p class="line-height-3">
              A world where drone fleets are seamlessly integrated into everyday
              operations across industries, managed through intelligent,
              matrix-based control systems.
            </p>
            <p class="line-height-3 mt-3">
              We envision our technology enabling new possibilities in
              agriculture, emergency response, infrastructure inspection, and
              beyond.
            </p>
            <div class="mt-4 flex justify-content-center">
              <i class="pi pi-eye text-6xl text-primary"></i>
            </div>
          </p-card>
        </div>

        <!-- Our Team -->
        <div class="col-12" @fadeIn>
          <p-card header="Our Team" styleClass="mb-4">
            <div class="grid">
              @for (member of teamMembers; track member.name) {
              <div class="col-12 md:col-6 lg:col-3 mb-4">
                <div
                  class="flex flex-column align-items-center text-center p-3 border-round"
                >
                  <p-avatar
                    [image]="member.avatar"
                    size="xlarge"
                    shape="circle"
                    class="mb-3"
                  ></p-avatar>
                  <h3 class="mb-1">{{ member.name }}</h3>
                  <p class="text-sm text-color-secondary mb-3">
                    {{ member.role }}
                  </p>
                  <p class="text-sm line-height-3">{{ member.bio }}</p>
                </div>
              </div>
              }
            </div>
          </p-card>
        </div>

        <!-- Company Timeline -->
        <div class="col-12" @fadeIn>
          <p-card header="Our Journey" styleClass="mb-4">
            <p-timeline [value]="events" align="alternate" styleClass="mt-4">
              <ng-template pTemplate="content" let-event>
                <div class="timeline-event p-3">
                  <div class="text-xl font-bold mb-1">{{ event.year }}</div>
                  <div class="text-color-secondary mb-2">{{ event.title }}</div>
                  <p>{{ event.description }}</p>
                </div>
              </ng-template>
              <ng-template pTemplate="opposite" let-event>
                <div class="timeline-icon-container">
                  <span
                    class="timeline-icon p-2 border-circle shadow-2"
                    [ngStyle]="{ 'background-color': event.color }"
                  >
                    <i [class]="'pi ' + event.icon + ' text-white'"></i>
                  </span>
                </div>
              </ng-template>
            </p-timeline>
          </p-card>
        </div>

        <!-- Technologies -->
        <div class="col-12" @fadeIn>
          <p-card header="Technologies We Use" styleClass="mb-4">
            <div class="grid">
              @for (tech of technologies; track tech.name) {
              <div class="col-6 md:col-4 lg:col-2 mb-3">
                <div
                  class="flex flex-column align-items-center text-center p-3"
                >
                  <div
                    class="tech-icon mb-3 flex align-items-center justify-content-center"
                  >
                    <i [class]="tech.icon + ' text-3xl'"></i>
                  </div>
                  <h4 class="mb-1">{{ tech.name }}</h4>
                  <p class="text-sm text-color-secondary">
                    {{ tech.category }}
                  </p>
                </div>
              </div>
              }
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

      .timeline-event {
        max-width: 300px;
      }

      .timeline-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
      }

      .tech-icon {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        background-color: var(--surface-ground);
      }

      :host ::ng-deep .p-card .p-card-title {
        font-size: 1.5rem;
        font-weight: 600;
      }

      @media (max-width: 768px) {
        .timeline-event {
          max-width: 100%;
        }
      }
    `,
  ],
})
export class AboutComponent implements OnInit {
  events: TimelineEvent[] = [];
  teamMembers: TeamMember[] = [];
  technologies: any[] = [];

  ngOnInit() {
    this.events = [
      {
        year: '2018',
        title: 'Company Founded',
        description:
          'DroneMatrix was established with a vision to revolutionize drone fleet management.',
        icon: 'pi-flag',
        color: '#3B82F6',
      },
      {
        year: '2019',
        title: 'First Matrix Control System',
        description:
          'Launched our first matrix-based drone control system for small fleets.',
        icon: 'pi-th-large',
        color: '#10B981',
      },
      {
        year: '2020',
        title: 'Enterprise Solution',
        description:
          'Expanded our offerings with enterprise-grade solutions for large-scale operations.',
        icon: 'pi-building',
        color: '#F59E0B',
      },
      {
        year: '2021',
        title: 'AI Integration',
        description:
          'Incorporated advanced AI algorithms for autonomous flight path optimization.',
        icon: 'pi-cog',
        color: '#8B5CF6',
      },
      {
        year: '2022',
        title: 'Global Expansion',
        description:
          'Expanded operations to serve clients across North America, Europe, and Asia.',
        icon: 'pi-globe',
        color: '#EC4899',
      },
      {
        year: '2023',
        title: 'Next-Gen Platform',
        description:
          'Launched our next-generation platform with enhanced 3D visualization and analytics.',
        icon: 'pi-cube',
        color: '#6366F1',
      },
    ];

    this.teamMembers = [
      {
        name: 'Adrián Jiménez Santiago',
        role: 'CEO & Founder',
        avatar: 'assets/images/team/adrianjpg',
        bio: 'Former aerospace engineer with 15+ years of experience in drone technology and systems integration.',
      },
    ];

    this.technologies = [
      { name: 'Angular', icon: 'pi pi-desktop', category: 'Frontend' },
      { name: 'Node.js', icon: 'pi pi-server', category: 'Backend' },
      { name: 'WebGL', icon: 'pi pi-cube', category: 'Visualization' },
      { name: 'TensorFlow', icon: 'pi pi-sitemap', category: 'AI/ML' },
      { name: 'MongoDB', icon: 'pi pi-database', category: 'Database' },
      { name: 'WebSockets', icon: 'pi pi-sync', category: 'Real-time' },
      { name: 'Docker', icon: 'pi pi-box', category: 'DevOps' },
      { name: 'AWS', icon: 'pi pi-cloud', category: 'Cloud' },
      { name: 'RxJS', icon: 'pi pi-refresh', category: 'Reactive' },
      { name: 'TypeScript', icon: 'pi pi-code', category: 'Language' },
      { name: 'PrimeNG', icon: 'pi pi-palette', category: 'UI Framework' },
      { name: 'Jest', icon: 'pi pi-check-circle', category: 'Testing' },
    ];
  }
}
