import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { DroneFormComponent } from './components/drone-form/drone-form.component';
import { DroneListComponent } from './components/drone-list/drone-list.component';
import { FlightControlComponent } from './components/flight-control/flight-control.component';
import { MatrixDetailComponent } from './components/matrix-detail/matrix-detail.component';
import { MatrixListComponent } from './components/matrix-list/matrix-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/matrices', pathMatch: 'full' },
  { path: 'matrices', component: MatrixListComponent },
  { path: 'matrices/:id', component: MatrixDetailComponent },
  { path: 'drones', component: DroneListComponent },
  { path: 'drones/new', component: DroneFormComponent },
  { path: 'drones/:id/edit', component: DroneFormComponent },
  { path: 'flight-control', component: FlightControlComponent },
  { path: '**', redirectTo: '/matrices' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
