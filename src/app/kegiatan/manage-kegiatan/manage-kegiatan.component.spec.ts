import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageKegiatanComponent } from './manage-kegiatan.component';

describe('ManageKegiatanComponent', () => {
  let component: ManageKegiatanComponent;
  let fixture: ComponentFixture<ManageKegiatanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageKegiatanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageKegiatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
