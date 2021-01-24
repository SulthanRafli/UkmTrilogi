import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbahBeritaComponent } from './ubah-berita.component';

describe('UbahBeritaComponent', () => {
  let component: UbahBeritaComponent;
  let fixture: ComponentFixture<UbahBeritaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UbahBeritaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbahBeritaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
