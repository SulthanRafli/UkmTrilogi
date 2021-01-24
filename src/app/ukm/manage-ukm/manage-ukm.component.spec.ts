import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUkmComponent } from './manage-ukm.component';

describe('ManageUkmComponent', () => {
  let component: ManageUkmComponent;
  let fixture: ComponentFixture<ManageUkmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUkmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUkmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
