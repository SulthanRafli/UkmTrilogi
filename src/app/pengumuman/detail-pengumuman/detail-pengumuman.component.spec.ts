import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPengumumanComponent } from './detail-pengumuman.component';

describe('DetailPengumumanComponent', () => {
  let component: DetailPengumumanComponent;
  let fixture: ComponentFixture<DetailPengumumanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPengumumanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPengumumanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
