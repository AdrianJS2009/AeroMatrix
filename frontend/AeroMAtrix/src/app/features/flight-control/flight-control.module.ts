import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightControlComponent } from '../../components/flight-control/flight-control.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [{ path: '', component: FlightControlComponent }];

@NgModule({
  declarations: [FlightControlComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [FlightControlComponent],
})
export class FlightControlModule {}
