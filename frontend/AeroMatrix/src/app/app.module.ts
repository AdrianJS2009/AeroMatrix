import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// PrimeNG Modules
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DroneDetailComponent } from './components/drone/drone-detail/drone-detail.component';
import { DroneListComponent } from './components/drone/drone-list/drone-list.component';
import { BatchCommandComponent } from './components/flight/batch-command/batch-command.component';
import { FlightControlComponent } from './components/flight/flight-control/flight-control.component';
import { MatrixDetailComponent } from './components/matrix/matrix-detail/matrix-detail.component';
import { MatrixGridComponent } from './components/matrix/matrix-grid/matrix-grid.component';
import { MatrixListComponent } from './components/matrix/matrix-list/matrix-list.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HeaderComponent } from './components/shared/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MatrixListComponent,
    MatrixDetailComponent,
    DroneListComponent,
    DroneDetailComponent,
    MatrixGridComponent,
    FlightControlComponent,
    BatchCommandComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule,
    ToolbarModule,
    MenubarModule,
    PanelModule,
    DividerModule,
    TabViewModule,
    ProgressSpinnerModule,
    TooltipModule,
    ChipModule,
    BadgeModule,
  ],
  providers: [MessageService, ConfirmationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
