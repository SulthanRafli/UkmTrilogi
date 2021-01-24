import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbahJadwalPendaftaranComponent } from './ubah-jadwal-pendaftaran.component';

describe('UbahJadwalPendaftaranComponent', () => {
  let component: UbahJadwalPendaftaranComponent;
  let fixture: ComponentFixture<UbahJadwalPendaftaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UbahJadwalPendaftaranComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbahJadwalPendaftaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
