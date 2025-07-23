import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioSociosComponent } from './inicio-socios.component';

describe('InicioSociosComponent', () => {
  let component: InicioSociosComponent;
  let fixture: ComponentFixture<InicioSociosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioSociosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioSociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
