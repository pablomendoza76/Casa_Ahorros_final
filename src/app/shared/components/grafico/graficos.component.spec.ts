import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficosComponent } from './graficos.component';

describe('GraficoComponent', () => {
  let component: GraficosComponent;
  let fixture: ComponentFixture<GraficosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
