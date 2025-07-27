import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoCreate } from './producto-create';

describe('ProductoCreate', () => {
  let component: ProductoCreate;
  let fixture: ComponentFixture<ProductoCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
