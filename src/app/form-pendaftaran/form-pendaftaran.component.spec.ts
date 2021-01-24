import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPendaftaranComponent } from './form-pendaftaran.component';

describe('FormPendaftaranComponent', () => {
  let component: FormPendaftaranComponent;
  let fixture: ComponentFixture<FormPendaftaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPendaftaranComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPendaftaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
