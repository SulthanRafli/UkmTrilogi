import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBeritaComponent } from './add-berita.component';

describe('AddBeritaComponent', () => {
  let component: AddBeritaComponent;
  let fixture: ComponentFixture<AddBeritaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBeritaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBeritaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
