import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPendaftaranComponent } from './detail-pendaftaran.component';

describe('DetailPendaftaranComponent', () => {
  let component: DetailPendaftaranComponent;
  let fixture: ComponentFixture<DetailPendaftaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPendaftaranComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPendaftaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
