import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPengumumanComponent } from './list-pengumuman.component';

describe('ListPengumumanComponent', () => {
  let component: ListPengumumanComponent;
  let fixture: ComponentFixture<ListPengumumanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPengumumanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPengumumanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
