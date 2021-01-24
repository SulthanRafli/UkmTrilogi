import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnggotaComponent } from './add-anggota.component';

describe('AddAnggotaComponent', () => {
  let component: AddAnggotaComponent;
  let fixture: ComponentFixture<AddAnggotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAnggotaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnggotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
