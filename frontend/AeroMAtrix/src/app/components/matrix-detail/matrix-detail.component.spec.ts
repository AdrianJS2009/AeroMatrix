import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixDetailComponent } from './matrix-detail.component';

describe('MatrixDetailComponent', () => {
  let component: MatrixDetailComponent;
  let fixture: ComponentFixture<MatrixDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrixDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrixDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
