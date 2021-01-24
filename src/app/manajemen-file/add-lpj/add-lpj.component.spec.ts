import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLpjComponent } from './add-lpj.component';

describe('AddLpjComponent', () => {
  let component: AddLpjComponent;
  let fixture: ComponentFixture<AddLpjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLpjComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLpjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
