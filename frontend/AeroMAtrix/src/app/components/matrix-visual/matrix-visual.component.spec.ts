import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixVisualComponent } from './matrix-visual.component';

describe('MatrixVisualComponent', () => {
  let component: MatrixVisualComponent;
  let fixture: ComponentFixture<MatrixVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrixVisualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrixVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
