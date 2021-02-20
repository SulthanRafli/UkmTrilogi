import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbahJadwalPertemuanComponent } from './ubah-jadwal-pertemuan.component';

describe('UbahJadwalPertemuanComponent', () => {
  let component: UbahJadwalPertemuanComponent;
  let fixture: ComponentFixture<UbahJadwalPertemuanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UbahJadwalPertemuanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbahJadwalPertemuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
