import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbahMahasiswaComponent } from './ubah-mahasiswa.component';

describe('UbahMahasiswaComponent', () => {
  let component: UbahMahasiswaComponent;
  let fixture: ComponentFixture<UbahMahasiswaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UbahMahasiswaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbahMahasiswaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
