import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneStatusComponent } from './drone-status.component';

describe('DroneStatusComponent', () => {
  let component: DroneStatusComponent;
  let fixture: ComponentFixture<DroneStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DroneStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DroneStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
