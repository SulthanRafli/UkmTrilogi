import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAnggotaComponent } from './manage-anggota.component';

describe('ManageAnggotaComponent', () => {
  let component: ManageAnggotaComponent;
  let fixture: ComponentFixture<ManageAnggotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAnggotaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAnggotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
