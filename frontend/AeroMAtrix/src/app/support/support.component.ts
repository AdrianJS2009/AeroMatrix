import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

interface KnowledgeBaseArticle {
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
    <div class="support-container p-4">
      <p-toast></p-toast>

      <div class="grid">
        <!-- Hero Section -->
        <div class="col-12" @fadeIn>
          <p-card styleClass="mb-4 hero-card">
            <div class="flex flex-column md:flex-row align-items-center">
              <div class="md:w-7 p-4">
                <h1 class="text-4xl font-bold mb-4">How Can We Help?</h1>
                <p class="text-xl line-height-3 mb-4">
                  Our support team is here to ensure you get the most out of
                  your DroneMatrix system.
                </p>
                <div class="search-container p-input-icon-left w-full mb-4">
                  <i class="pi pi-search"></i>
                  <input
                    type="text"
                    pInputText
                    placeholder="Search for help articles..."
                    class="w-full"
                  />
                </div>
                <div class="flex flex-wrap gap-2">
                  <p-button
                    label="Contact Support"
                    icon="pi pi-envelope"
                    styleClass="p-button-outlined"
                  ></p-button>
                  <p-button
                    label="View Documentation"
                    icon="pi pi-file"
                  ></p-button>
                </div>
              </div>
              <div class="md:w-5 flex justify-content-center">
                <img
                  src="assets/images/support-hero.svg"
                  alt="Support"
                  class="w-full max-w-25rem"
                />
              </div>
            </div>
          </p-card>
        </div>

        <!-- Support Tabs -->
        <div class="col-12">
          <p-tabView>
            <!-- FAQ Tab -->
            <p-tabPanel
              header="Frequently Asked Questions"
              leftIcon="pi pi-question-circle"
            >
              <div class="grid">
                <div class="col-12 md:col-4">
                  <div class="faq-categories p-3">
                    <h3 class="mb-3">Categories</h3>
                    <ul class="category-list p-0">
                      <li
                        *ngFor="let category of faqCategories"
                        (click)="selectFaqCategory(category)"
                        [class.active]="selectedFaqCategory === category"
                        class="p-3 mb-2 cursor-pointer border-round"
                      >
                        <i [class]="getCategoryIcon(category) + ' mr-2'"></i>
                        {{ category }}
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="col-12 md:col-8">
                  <p-accordion [multiple]="true" styleClass="faq-accordion">
                    @for (faq of filteredFaqs; track faq.question) {
                    <p-accordionTab [header]="faq.question">
                      <p class="line-height-3">{{ faq.answer }}</p>
                    </p-accordionTab>
                    }
                  </p-accordion>
                </div>
              </div>
            </p-tabPanel>

            <!-- Knowledge Base Tab -->
            <p-tabPanel header="Knowledge Base" leftIcon="pi pi-book">
              <div class="grid">
                @for (article of knowledgeBaseArticles; track article.id) {
                <div class="col-12 md:col-6 lg:col-4 mb-4">
                  <p-card styleClass="h-full kb-card">
                    <ng-template pTemplate="header">
                      <div class="kb-header p-3 flex align-items-center">
                        <i
                          [class]="'pi ' + article.icon + ' text-2xl mr-2'"
                        ></i>
                        <span class="text-sm font-semibold">{{
                          article.category
                        }}</span>
                      </div>
                    </ng-template>
                    <h3 class="mb-2">{{ article.title }}</h3>
                    <p class="line-height-3 mb-4">{{ article.summary }}</p>
                    <div class="flex justify-content-end">
                      <p-button
                        label="Read Article"
                        icon="pi pi-arrow-right"
                        styleClass="p-button-text"
                      ></p-button>
                    </div>
                  </p-card>
                </div>
                }
              </div>
            </p-tabPanel>

            <!-- Contact Support Tab -->
            <p-tabPanel header="Contact Support" leftIcon="pi pi-envelope">
              <div class="grid">
                <div class="col-12 md:col-6">
                  <p-card header="Submit a Support Ticket" styleClass="h-full">
                    <form
                      [formGroup]="supportForm"
                      (ngSubmit)="submitSupportRequest()"
                    >
                      <div class="field mb-4">
                        <label for="name" class="block mb-2">Name</label>
                        <input
                          id="name"
                          type="text"
                          pInputText
                          formControlName="name"
                          class="w-full"
                        />
                        <small
                          *ngIf="
                            supportForm.get('name')?.invalid &&
                            supportForm.get('name')?.touched
                          "
                          class="p-error"
                        >
                          Name is required
                        </small>
                      </div>

                      <div class="field mb-4">
                        <label for="email" class="block mb-2">Email</label>
                        <input
                          id="email"
                          type="email"
                          pInputText
                          formControlName="email"
                          class="w-full"
                        />
                        <small
                          *ngIf="
                            supportForm.get('email')?.invalid &&
                            supportForm.get('email')?.touched
                          "
                          class="p-error"
                        >
                          Valid email is required
                        </small>
                      </div>

                      <div class="field mb-4">
                        <label for="subject" class="block mb-2">Subject</label>
                        <input
                          id="subject"
                          type="text"
                          pInputText
                          formControlName="subject"
                          class="w-full"
                        />
                        <small
                          *ngIf="
                            supportForm.get('subject')?.invalid &&
                            supportForm.get('subject')?.touched
                          "
                          class="p-error"
                        >
                          Subject is required
                        </small>
                      </div>

                      <div class="field mb-4">
                        <label for="category" class="block mb-2"
                          >Category</label
                        >
                        <p-dropdown
                          id="category"
                          [options]="supportCategories"
                          formControlName="category"
                          placeholder="Select a category"
                          [style]="{ width: '100%' }"
                        ></p-dropdown>
                        <small
                          *ngIf="
                            supportForm.get('category')?.invalid &&
                            supportForm.get('category')?.touched
                          "
                          class="p-error"
                        >
                          Category is required
                        </small>
                      </div>

                      <div class="field mb-4">
                        <label for="message" class="block mb-2">Message</label>
                        <textarea
                          id="message"
                          pInputTextarea
                          formControlName="message"
                          rows="5"
                          class="w-full"
                        ></textarea>
                        <small
                          *ngIf="
                            supportForm.get('message')?.invalid &&
                            supportForm.get('message')?.touched
                          "
                          class="p-error"
                        >
                          Message is required (minimum 20 characters)
                        </small>
                      </div>

                      <div class="field-checkbox mb-4">
                        <p-checkbox
                          formControlName="attachLogs"
                          inputId="attachLogs"
                          [binary]="true"
                        ></p-checkbox>
                        <label for="attachLogs" class="ml-2"
                          >Attach system logs to help troubleshoot</label
                        >
                      </div>

                      <div class="flex justify-content-end">
                        <p-button
                          type="submit"
                          label="Submit Request"
                          icon="pi pi-send"
                          [disabled]="supportForm.invalid"
                        ></p-button>
                      </div>
                    </form>
                  </p-card>
                </div>

                <div class="col-12 md:col-6">
                  <p-card header="Support Information" styleClass="mb-4">
                    <div class="support-info">
                      <div class="mb-4">
                        <h3 class="mb-2">Business Hours</h3>
                        <p class="line-height-3">
                          Monday - Friday: 9:00 AM - 6:00 PM EST
                        </p>
                        <p class="line-height-3">
                          Saturday: 10:00 AM - 2:00 PM EST
                        </p>
                        <p class="line-height-3">Sunday: Closed</p>
                      </div>

                      <div class="mb-4">
                        <h3 class="mb-2">Response Times</h3>
                        <p class="line-height-3">Critical Issues: 2-4 hours</p>
                        <p class="line-height-3">High Priority: 24 hours</p>
                        <p class="line-height-3">Normal Priority: 48 hours</p>
                        <p class="line-height-3">Low Priority: 72 hours</p>
                      </div>

                      <div class="mb-4">
                        <h3 class="mb-2">Contact Information</h3>
                        <p class="line-height-3">
                          <i class="pi pi-envelope mr-2"></i>
                          support&#64;dronematrix.com
                        </p>
                        <p class="line-height-3">
                          <i class="pi pi-phone mr-2"></i> +1 (555) 123-4567
                        </p>
                      </div>
                    </div>
                  </p-card>

                  <p-card
                    header="Emergency Support"
                    styleClass="emergency-card"
                  >
                    <div class="emergency-support p-3">
                      <div class="flex align-items-center mb-3">
                        <i class="pi pi-exclamation-triangle text-3xl mr-3"></i>
                        <h3 class="m-0">24/7 Emergency Support</h3>
                      </div>
                      <p class="line-height-3 mb-3">
                        For critical issues affecting production systems or
                        causing significant operational impact, please use our
                        emergency support line.
                      </p>
                      <div
                        class="emergency-number p-3 text-center border-round mb-3"
                      >
                        <span class="font-bold text-xl"
                          >+1 (555) 911-DRONE</span
                        >
                      </div>
                      <p class="text-sm">
                        Note: This line is for genuine emergencies only. Misuse
                        may result in additional charges.
                      </p>
                    </div>
                  </p-card>
                </div>
              </div>
            </p-tabPanel>
          </p-tabView>
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

      .faq-categories {
        background-color: var(--surface-ground);
        border-radius: var(--border-radius);
      }

      .category-list {
        list-style-type: none;
        margin: 0;
      }

      .category-list li {
        background-color: var(--surface-card);
        transition: background-color 0.2s, transform 0.2s;
      }

      .category-list li:hover {
        background-color: var(--surface-hover);
        transform: translateX(5px);
      }

      .category-list li.active {
        background-color: var(--primary-color);
        color: var(--primary-color-text);
      }

      .kb-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .kb-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      }

      .kb-header {
        background-color: var(--surface-ground);
      }

      .emergency-card ::ng-deep .p-card-header {
        background-color: #ef4444;
        color: white;
        padding: 0.75rem 1.25rem;
      }

      .emergency-number {
        background-color: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }

      :host ::ng-deep .p-tabview .p-tabview-nav {
        justify-content: center;
        margin-bottom: 2rem;
      }

      :host ::ng-deep .p-tabview .p-tabview-nav li .p-tabview-nav-link {
        padding: 1rem 1.5rem;
      }

      :host ::ng-deep .faq-accordion .p-accordion-header-link {
        padding: 1.25rem;
      }

      :host ::ng-deep .faq-accordion .p-accordion-content {
        padding: 1.25rem;
      }
    `,
  ],
})
export class SupportComponent {
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

  get filteredFaqs(): FAQ[] {
    return this.faqs.filter((faq) => faq.category === this.selectedFaqCategory);
  }

  selectFaqCategory(category: string): void {
    this.selectedFaqCategory = category;
  }

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

  submitSupportRequest(): void {
    if (this.supportForm.valid) {
      this.messageService.add({
        severity: 'success',
        summary: 'Request Submitted',
        detail:
          'Your support request has been submitted successfully. We will contact you shortly.',
        life: 5000,
      });

      // Reset the form
      this.supportForm.reset({
        attachLogs: false,
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly.',
        life: 5000,
      });

      // Mark all fields as touched to trigger validation messages
      Object.keys(this.supportForm.controls).forEach((key) => {
        const control = this.supportForm.get(key);
        control?.markAsTouched();
      });
    }
  }

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
