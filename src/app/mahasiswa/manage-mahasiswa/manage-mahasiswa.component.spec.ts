import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMahasiswaComponent } from './manage-mahasiswa.component';

describe('ManageMahasiswaComponent', () => {
  let component: ManageMahasiswaComponent;
  let fixture: ComponentFixture<ManageMahasiswaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageMahasiswaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMahasiswaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
