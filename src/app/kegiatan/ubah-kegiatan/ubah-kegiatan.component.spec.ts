import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbahKegiatanComponent } from './ubah-kegiatan.component';

describe('UbahKegiatanComponent', () => {
  let component: UbahKegiatanComponent;
  let fixture: ComponentFixture<UbahKegiatanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UbahKegiatanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbahKegiatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
