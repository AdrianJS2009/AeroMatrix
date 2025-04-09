import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

// FAQ and Knowledge Base interfaces
export interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  icon: string;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    TabViewModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    AccordionModule,
    DividerModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    CheckboxModule,
    TranslateModule,
  ],
  providers: [MessageService],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
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
export class SupportComponent implements OnInit {
  supportForm: FormGroup;
  faqCategories: string[] = [
    'General',
    'Account',
    'Drones',
    'Matrices',
    'Flights',
    'Billing',
  ];
  selectedFaqCategory = 'General';
  supportCategories: any[] = [
    { label: 'Technical Support', value: 'technical' },
    { label: 'Account Issues', value: 'account' },
    { label: 'Billing Questions', value: 'billing' },
    { label: 'Feature Requests', value: 'feature' },
    { label: 'Bug Report', value: 'bug' },
  ];

  faqs: FAQ[] = [];
  knowledgeBaseArticles: KnowledgeBaseArticle[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService
  ) {
    // Initialize the support form using reactive forms
    this.supportForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      category: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(20)]],
      attachLogs: [false],
    });

    this.initializeFaqs();
    this.initializeKnowledgeBase();
  }

  ngOnInit(): void {}

  // Getter to filter FAQs by the selected category
  get filteredFaqs(): FAQ[] {
    return this.faqs.filter((faq) => faq.category === this.selectedFaqCategory);
  }

  // TrackBy function for FAQs
  trackByFaq(index: number, faq: FAQ): string {
    return faq.question;
  }

  // TrackBy function for knowledge base articles
  trackByArticle(index: number, article: KnowledgeBaseArticle): string {
    return article.id;
  }

  // Called when a FAQ category is clicked
  selectFaqCategory(category: string): void {
    this.selectedFaqCategory = category;
  }

  // Returns the corresponding icon for a category or a default icon
  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      General: 'pi pi-info-circle',
      Account: 'pi pi-user',
      Drones: 'pi pi-send',
      Matrices: 'pi pi-th-large',
      Flights: 'pi pi-map',
      Billing: 'pi pi-credit-card',
    };

    return icons[category] || 'pi pi-info-circle';
  }

  // Submit
  submitSupportRequest(): void {
    if (this.supportForm.valid) {
      this.messageService.add({
        severity: 'success',
        summary: 'Request Submitted',
        detail:
          'Your support request has been submitted successfully. We will contact you shortly.',
        life: 5000,
      });
      // Reset form state
      this.supportForm.reset({ attachLogs: false });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly.',
        life: 5000,
      });
      Object.keys(this.supportForm.controls).forEach((key) => {
        this.supportForm.get(key)?.markAsTouched();
      });
    }
  }

  // Initialize FAQs with mock data
  private initializeFaqs(): void {
    this.faqs = [
      {
        question: 'How do I register a new drone in the system?',
        answer:
          'To register a new drone, navigate to the Drones section and click on the "Add Drone" button. Fill in the required information including the drone model, serial number, and specifications. Once submitted, the drone will be added to your fleet inventory.',
        category: 'Drones',
      },
      {
        question: 'What is a drone matrix?',
        answer:
          'A drone matrix is a formation or arrangement of multiple drones that operate in coordination. Our system allows you to create, manage, and control these matrices for synchronized flight operations, enabling complex maneuvers and efficient coverage of large areas.',
        category: 'Matrices',
      },
      {
        question: 'How do I create a flight plan?',
        answer:
          'To create a flight plan, go to the Flights section and select "New Flight Plan." You can then define waypoints, set altitude and speed parameters, and assign tasks at specific points. The system will validate your plan for safety and regulatory compliance before allowing execution.',
        category: 'Flights',
      },
      {
        question: 'Can I control multiple drones simultaneously?',
        answer:
          'Yes, our system supports batch commands that allow you to control multiple drones simultaneously. You can select individual drones or entire matrices and issue commands that will be executed by all selected units in coordination.',
        category: 'Flights',
      },
      {
        question: 'How do I update my account information?',
        answer:
          'To update your account information, go to the Settings section and select the "Account" tab. From there, you can modify your personal details, change your password, and manage notification preferences.',
        category: 'Account',
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers. All payment information is securely processed and stored in compliance with PCI DSS standards.',
        category: 'Billing',
      },
      {
        question: 'How often should I update drone firmware?',
        answer:
          'We recommend checking for firmware updates at least once a month. Critical security updates should be applied immediately. The system will notify you when new firmware versions are available for your registered drones.',
        category: 'Drones',
      },
      {
        question: 'What is the difference between single and batch commands?',
        answer:
          'Single commands are issued to individual drones, while batch commands are sent to multiple drones simultaneously. Batch commands are useful for coordinated operations but require more careful planning to ensure safe execution across all units.',
        category: 'Flights',
      },
      {
        question: 'How do I export flight data for analysis?',
        answer:
          'To export flight data, navigate to the Analytics section and select the flights you want to analyze. Click on the "Export" button and choose your preferred format (CSV, JSON, or Excel). You can also set up automatic exports to your connected data analytics platforms.',
        category: 'General',
      },
      {
        question: 'Is there a limit to how many drones I can manage?',
        answer:
          'The number of drones you can manage depends on your subscription plan. Basic plans support up to 10 drones, while enterprise plans can handle unlimited fleet sizes with advanced management features.',
        category: 'General',
      },
    ];
  }

  // Initialize knowledge base articles with mock data
  private initializeKnowledgeBase(): void {
    this.knowledgeBaseArticles = [
      {
        id: 'kb-001',
        title: 'Getting Started with DroneMatrix',
        summary:
          'A comprehensive guide to setting up your account, registering your first drone, and executing your first flight.',
        category: 'Beginner Guides',
        icon: 'pi-flag',
      },
      {
        id: 'kb-002',
        title: 'Understanding Drone Matrices',
        summary:
          'Learn about the concept of drone matrices, their benefits, and how to create effective formations for different scenarios.',
        category: 'Matrices',
        icon: 'pi-th-large',
      },
      {
        id: 'kb-003',
        title: 'Advanced Flight Planning',
        summary:
          'Discover techniques for creating complex flight plans with multiple waypoints, tasks, and conditional logic.',
        category: 'Flights',
        icon: 'pi-map',
      },
      {
        id: 'kb-004',
        title: 'Drone Maintenance Best Practices',
        summary:
          'Essential maintenance procedures to keep your drone fleet in optimal condition and extend equipment lifespan.',
        category: 'Maintenance',
        icon: 'pi-wrench',
      },
      {
        id: 'kb-005',
        title: 'Interpreting Flight Analytics',
        summary:
          'How to use the analytics dashboard to gain insights into flight performance, efficiency, and potential issues.',
        category: 'Analytics',
        icon: 'pi-chart-bar',
      },
      {
        id: 'kb-006',
        title: 'Regulatory Compliance Guide',
        summary:
          'Overview of drone regulations in different regions and how our system helps maintain compliance.',
        category: 'Compliance',
        icon: 'pi-check-circle',
      },
      {
        id: 'kb-007',
        title: 'Troubleshooting Connection Issues',
        summary:
          'Steps to diagnose and resolve common connectivity problems between the control system and drones.',
        category: 'Troubleshooting',
        icon: 'pi-wifi',
      },
      {
        id: 'kb-008',
        title: 'API Integration Guide',
        summary:
          'Documentation for integrating DroneMatrix with third-party systems using our comprehensive API.',
        category: 'Development',
        icon: 'pi-code',
      },
      {
        id: 'kb-009',
        title: 'Battery Management Strategies',
        summary:
          'Best practices for managing drone batteries to maximize flight time and battery lifespan.',
        category: 'Maintenance',
        icon: 'pi-battery',
      },
    ];
  }
}
