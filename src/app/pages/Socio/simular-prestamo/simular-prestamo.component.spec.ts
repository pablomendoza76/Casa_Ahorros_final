import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimularPrestamoComponent } from './simular-prestamo.component';

describe('SimularPrestamoComponent', () => {
  let component: SimularPrestamoComponent;
  let fixture: ComponentFixture<SimularPrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimularPrestamoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimularPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
