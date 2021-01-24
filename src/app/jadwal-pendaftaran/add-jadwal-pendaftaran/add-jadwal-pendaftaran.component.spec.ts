import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJadwalPendaftaranComponent } from './add-jadwal-pendaftaran.component';

describe('AddJadwalPendaftaranComponent', () => {
  let component: AddJadwalPendaftaranComponent;
  let fixture: ComponentFixture<AddJadwalPendaftaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJadwalPendaftaranComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJadwalPendaftaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
