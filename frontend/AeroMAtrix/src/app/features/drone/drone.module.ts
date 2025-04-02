import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

// Components
import { DroneFormComponent } from '../../components/drone-form/drone-form.component';
import { DroneListComponent } from '../../components/drone-list/drone-list.component';
import { DroneStatusComponent } from '../../components/drone-status/drone-status.component';

const routes: Routes = [
  { path: 'drones', component: DroneListComponent },
  { path: 'drones/new', component: DroneFormComponent },
  { path: 'drones/:id/edit', component: DroneFormComponent },
];

@NgModule({
  declarations: [DroneListComponent, DroneFormComponent, DroneStatusComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [DroneListComponent, DroneFormComponent, DroneStatusComponent],
})
export class DroneModule {}
