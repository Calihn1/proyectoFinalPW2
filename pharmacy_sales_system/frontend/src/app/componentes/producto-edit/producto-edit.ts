import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../../services/producto';
import { CommonModule } from '@angular/common';
import { ProductoForm } from '../producto-form/producto-form';

@Component({
  selector: 'app-producto-edit',
  imports: [CommonModule, ProductoForm],
  templateUrl: './producto-edit.html',
  styleUrl: './producto-edit.css'
})
export class ProductoEdit implements OnInit {
  producto: any;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: Producto
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productoService.obtenerProducto(id).subscribe(data => {
      this.producto = data;
    });
  }

  editarProducto(producto: any): void {
    this.productoService.actualizarProducto(producto).subscribe({
      next: () => {
        console.log('Producto actualizado con éxito');
        this.router.navigate(['/productos']);
      },
      error: (err) => console.error('Error al actualizar producto', err)
    });
  }
}