import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailUkmComponent } from './detail-ukm.component';

describe('DetailUkmComponent', () => {
  let component: DetailUkmComponent;
  let fixture: ComponentFixture<DetailUkmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailUkmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailUkmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
