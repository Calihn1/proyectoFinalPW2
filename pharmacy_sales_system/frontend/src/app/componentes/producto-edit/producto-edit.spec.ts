import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoEdit } from './producto-edit';

describe('ProductoEdit', () => {
  let component: ProductoEdit;
  let fixture: ComponentFixture<ProductoEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
