import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInforme } from './modal-informe';

describe('ModalInforme', () => {
  let component: ModalInforme;
  let fixture: ComponentFixture<ModalInforme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInforme]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInforme);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
