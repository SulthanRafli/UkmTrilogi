import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUkmComponent } from './add-ukm.component';

describe('AddUkmComponent', () => {
  let component: AddUkmComponent;
  let fixture: ComponentFixture<AddUkmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUkmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUkmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
