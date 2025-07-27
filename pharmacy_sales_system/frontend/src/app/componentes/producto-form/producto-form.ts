import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-producto-form',
  imports: [CommonModule, RouterLink, FormsModule ],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css'
})
export class ProductoForm {
  @Input() producto: any = {};
  @Output() guardar = new EventEmitter<any>();

  onSubmit(): void {
    this.guardar.emit(this.producto);
  }
}
