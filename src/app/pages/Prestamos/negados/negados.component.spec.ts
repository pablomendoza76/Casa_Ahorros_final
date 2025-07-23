import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegadosComponent } from './negados.component';

describe('NegadosComponent', () => {
  let component: NegadosComponent;
  let fixture: ComponentFixture<NegadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NegadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NegadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
