import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbahAdminComponent } from './ubah-admin.component';

describe('UbahAdminComponent', () => {
  let component: UbahAdminComponent;
  let fixture: ComponentFixture<UbahAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UbahAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbahAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
