import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUkmComponent } from './profile-ukm.component';

describe('ProfileUkmComponent', () => {
  let component: ProfileUkmComponent;
  let fixture: ComponentFixture<ProfileUkmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileUkmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileUkmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
