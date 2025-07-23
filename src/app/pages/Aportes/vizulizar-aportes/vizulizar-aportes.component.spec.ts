import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarAportesComponent } from './vizulizar-aportes.component';

describe('VizulizarAportesComponent', () => {
  let component: VisualizarAportesComponent;
  let fixture: ComponentFixture<VisualizarAportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarAportesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarAportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
