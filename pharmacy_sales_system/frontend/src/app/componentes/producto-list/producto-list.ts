import { Component, OnInit } from '@angular/core';
import { Producto } from '../../services/producto';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-producto-list',
  imports: [ CommonModule, RouterLink, RouterModule, Navbar],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.css'
})
export class ProductoList implements OnInit {
  productos: any[] = [];

  constructor(private productoService: Producto) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.listarProductos().subscribe(data => {
      this.productos = data;
    });
  }

  confirmarEliminacion(producto: any): void {
    const confirmacion = confirm(`¿Estás seguro de que quieres eliminar el producto "${producto.nombre}" (ID: ${producto.id})?`);

    if (confirmacion) {
      this.eliminarProducto(producto.id);
    }
  }

  private eliminarProducto(id: number): void {
    this.productoService.eliminarProducto(id).subscribe({
      next: () => {
        console.log(`Producto con ID ${id} eliminado con éxito.`);
        this.cargarProductos();
      },
      error: (err) => console.error(`Error al eliminar producto con ID ${id}`, err)
    });
  }
}
