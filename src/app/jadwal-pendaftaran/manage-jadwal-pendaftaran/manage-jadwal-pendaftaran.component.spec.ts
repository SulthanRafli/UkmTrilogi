import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJadwalPendaftaranComponent } from './manage-jadwal-pendaftaran.component';

describe('ManageJadwalPendaftaranComponent', () => {
  let component: ManageJadwalPendaftaranComponent;
  let fixture: ComponentFixture<ManageJadwalPendaftaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageJadwalPendaftaranComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageJadwalPendaftaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
