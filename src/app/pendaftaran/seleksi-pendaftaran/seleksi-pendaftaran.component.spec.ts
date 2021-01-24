import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleksiPendaftaranComponent } from './seleksi-pendaftaran.component';

describe('SeleksiPendaftaranComponent', () => {
  let component: SeleksiPendaftaranComponent;
  let fixture: ComponentFixture<SeleksiPendaftaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeleksiPendaftaranComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleksiPendaftaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
