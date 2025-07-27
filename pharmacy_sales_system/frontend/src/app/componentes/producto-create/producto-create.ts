import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Producto } from '../../services/producto';
import { ProductoForm } from '../producto-form/producto-form';

@Component({
  selector: 'app-producto-create',
  imports: [CommonModule, ProductoForm],
  templateUrl: './producto-create.html',
  styleUrl: './producto-create.css'
})
export class ProductoCreate {
  productoInicial: any = {
    estado: true,
  };
  constructor(
    private productoService: Producto,
    private router: Router
  ) {}
  crearProducto(producto: any): void {
    const datosAEnviar = { ...producto };
    console.log("Campo 'created_at' vacío, usando la fecha actual.");
    datosAEnviar.created_at = new Date().toISOString();
    this.productoService.agregarProducto(datosAEnviar).subscribe({
      next: () => {
        console.log('Producto creado con éxito');
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        console.error('Error al crear producto:', err.error);
      }
    });
  }
}