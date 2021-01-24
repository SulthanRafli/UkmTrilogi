import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanPendaftaranComponent } from './laporan-pendaftaran.component';

describe('LaporanPendaftaranComponent', () => {
  let component: LaporanPendaftaranComponent;
  let fixture: ComponentFixture<LaporanPendaftaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaporanPendaftaranComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanPendaftaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
