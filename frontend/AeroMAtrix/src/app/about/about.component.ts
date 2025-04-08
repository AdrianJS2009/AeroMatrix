import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
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
})
export class AboutComponent implements OnInit {
  events: TimelineEvent[] = [];
  teamMembers: TeamMember[] = [];
  technologies: { name: string; icon: string; category: string }[] = [];

  ngOnInit(): void {
    this.events = [
      {
        year: '2018',
        title: 'Company Founded',
        description: 'DroneMatrix was established...',
        icon: 'pi-flag',
        color: '#3B82F6',
      },
      {
        year: '2019',
        title: 'First Matrix Control System',
        description: 'Launched our first matrix...',
        icon: 'pi-th-large',
        color: '#10B981',
      },
      {
        year: '2020',
        title: 'Enterprise Solution',
        description: 'Expanded our offerings...',
        icon: 'pi-building',
        color: '#F59E0B',
      },
      {
        year: '2021',
        title: 'AI Integration',
        description: 'Incorporated advanced AI...',
        icon: 'pi-cog',
        color: '#8B5CF6',
      },
      {
        year: '2022',
        title: 'Global Expansion',
        description: 'Expanded operations to serve...',
        icon: 'pi-globe',
        color: '#EC4899',
      },
      {
        year: '2023',
        title: 'Next-Gen Platform',
        description: 'Launched our next-generation...',
        icon: 'pi-cube',
        color: '#6366F1',
      },
    ];

    this.teamMembers = [
      {
        name: 'Adrián Jiménez Santiago',
        role: 'CEO & Founder',
        avatar: 'assets/images/team/adrianjpg',
        bio: 'Former aerospace engineer with 15+ years of experience in drone tech and systems integration.',
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
