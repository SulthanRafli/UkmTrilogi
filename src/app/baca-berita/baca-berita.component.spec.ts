import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacaBeritaComponent } from './baca-berita.component';

describe('BacaBeritaComponent', () => {
  let component: BacaBeritaComponent;
  let fixture: ComponentFixture<BacaBeritaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BacaBeritaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BacaBeritaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
