import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLpjComponent } from './manage-lpj.component';

describe('ManageLpjComponent', () => {
  let component: ManageLpjComponent;
  let fixture: ComponentFixture<ManageLpjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageLpjComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLpjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
