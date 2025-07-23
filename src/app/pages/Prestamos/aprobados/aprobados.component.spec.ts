import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobadosComponent } from './aprobados.component';

describe('AprobadosComponent', () => {
  let component: AprobadosComponent;
  let fixture: ComponentFixture<AprobadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AprobadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AprobadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
