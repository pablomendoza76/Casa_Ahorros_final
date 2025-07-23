import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAportesComponent } from './gestion-aportes.component';

describe('GestionAportesComponent', () => {
  let component: GestionAportesComponent;
  let fixture: ComponentFixture<GestionAportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAportesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
