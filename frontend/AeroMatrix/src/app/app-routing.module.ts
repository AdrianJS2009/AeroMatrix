import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DroneDetailComponent } from './components/drone/drone-detail/drone-detail.component';
import { DroneListComponent } from './components/drone/drone-list/drone-list.component';
import { BatchCommandComponent } from './components/flight/batch-command/batch-command.component';
import { FlightControlComponent } from './components/flight/flight-control/flight-control.component';
import { MatrixDetailComponent } from './components/matrix/matrix-detail/matrix-detail.component';
import { MatrixListComponent } from './components/matrix/matrix-list/matrix-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'matrices', component: MatrixListComponent },
  { path: 'matrices/:id', component: MatrixDetailComponent },
  { path: 'drones', component: DroneListComponent },
  { path: 'drones/:id', component: DroneDetailComponent },
  { path: 'flight-control', component: FlightControlComponent },
  { path: 'batch-commands', component: BatchCommandComponent },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
