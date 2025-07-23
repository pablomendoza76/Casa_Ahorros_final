import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosRetirosComponent } from './pagos-retiros.component';

describe('PagosRetirosComponent', () => {
  let component: PagosRetirosComponent;
  let fixture: ComponentFixture<PagosRetirosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagosRetirosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagosRetirosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
