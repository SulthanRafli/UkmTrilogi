import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProkerComponent } from './manage-proker.component';

describe('ManageProkerComponent', () => {
  let component: ManageProkerComponent;
  let fixture: ComponentFixture<ManageProkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageProkerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
