import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionAporteComponent } from './creacion-aporte.component';

describe('CreacionAporteComponent', () => {
  let component: CreacionAporteComponent;
  let fixture: ComponentFixture<CreacionAporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreacionAporteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreacionAporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
