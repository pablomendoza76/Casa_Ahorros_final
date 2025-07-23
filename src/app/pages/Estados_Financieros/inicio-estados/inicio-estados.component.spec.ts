import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioEstadosComponent } from './inicio-estados.component';

describe('InicioEstadosComponent', () => {
  let component: InicioEstadosComponent;
  let fixture: ComponentFixture<InicioEstadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioEstadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioEstadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
