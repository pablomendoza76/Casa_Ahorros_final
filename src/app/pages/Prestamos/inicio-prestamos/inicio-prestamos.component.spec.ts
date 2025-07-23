import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioPrestamosComponent } from './inicio-prestamos.component';

describe('InicioPrestamosComponent', () => {
  let component: InicioPrestamosComponent;
  let fixture: ComponentFixture<InicioPrestamosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioPrestamosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioPrestamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
