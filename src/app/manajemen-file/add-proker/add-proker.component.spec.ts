import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProkerComponent } from './add-proker.component';

describe('AddProkerComponent', () => {
  let component: AddProkerComponent;
  let fixture: ComponentFixture<AddProkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProkerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
