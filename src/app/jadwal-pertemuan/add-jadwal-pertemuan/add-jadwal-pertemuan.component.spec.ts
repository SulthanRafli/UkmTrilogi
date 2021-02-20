import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJadwalPertemuanComponent } from './add-jadwal-pertemuan.component';

describe('AddJadwalPertemuanComponent', () => {
  let component: AddJadwalPertemuanComponent;
  let fixture: ComponentFixture<AddJadwalPertemuanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJadwalPertemuanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJadwalPertemuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
