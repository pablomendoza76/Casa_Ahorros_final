import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMensajeComponent } from './popup-mensaje.component';

describe('PopupMensajeComponent', () => {
  let component: PopupMensajeComponent;
  let fixture: ComponentFixture<PopupMensajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupMensajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupMensajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
