import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// PrimeNG Components
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

// Shared Components
import { NavbarComponent } from '../components/navbar/navbar.component';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // PrimeNG Modules
    TableModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    InputNumberModule,
    ToolbarModule,
    PanelModule,
    DividerModule,
    ChipModule,
    ProgressSpinnerModule,
    TooltipModule,
  ],
  exports: [
    // Angular Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // PrimeNG Modules
    TableModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    InputNumberModule,
    ToolbarModule,
    PanelModule,
    DividerModule,
    ChipModule,
    ProgressSpinnerModule,
    TooltipModule,
    // Components
    NavbarComponent,
  ],
  providers: [MessageService, ConfirmationService],
})
export class SharedModule {}
