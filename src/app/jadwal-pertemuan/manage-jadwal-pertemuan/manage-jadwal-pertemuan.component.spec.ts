import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJadwalPertemuanComponent } from './manage-jadwal-pertemuan.component';

describe('ManageJadwalPertemuanComponent', () => {
  let component: ManageJadwalPertemuanComponent;
  let fixture: ComponentFixture<ManageJadwalPertemuanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageJadwalPertemuanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageJadwalPertemuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
