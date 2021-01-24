import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBeritaComponent } from './manage-berita.component';

describe('ManageBeritaComponent', () => {
  let component: ManageBeritaComponent;
  let fixture: ComponentFixture<ManageBeritaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageBeritaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBeritaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
