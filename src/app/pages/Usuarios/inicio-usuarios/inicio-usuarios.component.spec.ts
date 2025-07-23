import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioUsuariosComponent } from './inicio-usuarios.component';

describe('InicioUsuariosComponent', () => {
  let component: InicioUsuariosComponent;
  let fixture: ComponentFixture<InicioUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
