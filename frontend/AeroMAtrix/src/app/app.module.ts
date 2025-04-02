import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DroneFormComponent } from './components/drone-form/drone-form.component';
import { DroneListComponent } from './components/drone-list/drone-list.component';
import { DroneStatusComponent } from './components/drone-status/drone-status.component';
import { FlightControlComponent } from './components/flight-control/flight-control.component';
import { MatrixDetailComponent } from './components/matrix-detail/matrix-detail.component';
import { MatrixFormComponent } from './components/matrix-form/matrix-form.component';
import { MatrixListComponent } from './components/matrix-list/matrix-list.component';
import { MatrixVisualComponent } from './components/matrix-visual/matrix-visual.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    MatrixListComponent,
    MatrixDetailComponent,
    DroneListComponent,
    DroneFormComponent,
    DroneStatusComponent,
    FlightControlComponent,
    NavbarComponent,
    MatrixFormComponent,
    MatrixVisualComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,

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
  ],
  providers: [MessageService, ConfirmationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
