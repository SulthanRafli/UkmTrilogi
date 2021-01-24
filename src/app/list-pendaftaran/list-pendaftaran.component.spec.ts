import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPendaftaranComponent } from './list-pendaftaran.component';

describe('ListPendaftaranComponent', () => {
  let component: ListPendaftaranComponent;
  let fixture: ComponentFixture<ListPendaftaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPendaftaranComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPendaftaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
