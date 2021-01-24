import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbahUkmComponent } from './ubah-ukm.component';

describe('UbahUkmComponent', () => {
  let component: UbahUkmComponent;
  let fixture: ComponentFixture<UbahUkmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UbahUkmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbahUkmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
