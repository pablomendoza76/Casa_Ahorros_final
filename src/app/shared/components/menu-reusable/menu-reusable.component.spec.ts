import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuReusableComponent } from './menu-reusable.component';

describe('MenuReusableComponent', () => {
  let component: MenuReusableComponent;
  let fixture: ComponentFixture<MenuReusableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuReusableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuReusableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
