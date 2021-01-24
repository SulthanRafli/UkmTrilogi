import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbahLpjComponent } from './ubah-lpj.component';

describe('UbahLpjComponent', () => {
  let component: UbahLpjComponent;
  let fixture: ComponentFixture<UbahLpjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UbahLpjComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbahLpjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
