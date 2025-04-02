import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { DroneService } from '../services/drone.service';
import { FlightService } from '../services/flight.service';
import { MatrixService } from '../services/matrix.service';

@NgModule({
  imports: [CommonModule],
  providers: [DroneService, MatrixService, FlightService],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it only in AppModule.'
      );
    }
  }
}
