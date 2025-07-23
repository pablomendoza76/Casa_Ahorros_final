import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesactivarComponent } from './desactivar.component';

describe('DesactivarComponent', () => {
  let component: DesactivarComponent;
  let fixture: ComponentFixture<DesactivarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesactivarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesactivarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
