import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraPrestamosComponent } from './cartera-prestamos.component';

describe('CarteraPrestamosComponent', () => {
  let component: CarteraPrestamosComponent;
  let fixture: ComponentFixture<CarteraPrestamosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteraPrestamosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteraPrestamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
