import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbahProkerComponent } from './ubah-proker.component';

describe('UbahProkerComponent', () => {
  let component: UbahProkerComponent;
  let fixture: ComponentFixture<UbahProkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UbahProkerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbahProkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
