import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class Producto {
  private basePath = '/producto/';

  constructor(private api: Api) {}

  public listarProductos(): Observable<any> {
    return this.api.get<any>(this.basePath);
  }

  public obtenerProducto(id: number): Observable<any> {
    return this.api.get<any>(`${this.basePath}${id}/`);
  }

  public agregarProducto(producto: any): Observable<any> {
    return this.api.post<any>(this.basePath, producto);
  }

  public actualizarProducto(producto: any): Observable<any> {
    return this.api.patch<any>(`${this.basePath}${producto.id}/`, producto);
  }

  public eliminarProducto(id: number): Observable<any> {
    return this.api.delete<any>(`${this.basePath}${id}/`);
  }
}