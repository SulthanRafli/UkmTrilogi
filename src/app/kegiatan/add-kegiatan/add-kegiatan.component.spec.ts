import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKegiatanComponent } from './add-kegiatan.component';

describe('AddKegiatanComponent', () => {
  let component: AddKegiatanComponent;
  let fixture: ComponentFixture<AddKegiatanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddKegiatanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKegiatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
