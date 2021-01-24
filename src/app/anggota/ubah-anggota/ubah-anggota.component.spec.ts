import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbahAnggotaComponent } from './ubah-anggota.component';

describe('UbahAnggotaComponent', () => {
  let component: UbahAnggotaComponent;
  let fixture: ComponentFixture<UbahAnggotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UbahAnggotaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbahAnggotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
