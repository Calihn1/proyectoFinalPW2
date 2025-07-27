import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VentaCreada {
  id: number;
  usuario: {
    first_name: string;
    last_name: string;
  };
  fecha: string;
  descuento: string;
  total_bruto: string;
  total_neto: string;
  detalles: any[];
}

export interface VentaD {
  descuento: number;
  detalles: {
    producto: number;
    cantidad: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class Venta {
  private http = inject(HttpClient);
  private apiUrl = 'https://proyectofinalpw2.onrender.com/api/ventas';

  crearVenta(ventaData: VentaD): Observable<VentaCreada> {
    return this.http.post<VentaCreada>(this.apiUrl + '/', ventaData);
  }

  getComprobantePdf(ventaId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${ventaId}/generar_comprobante_pdf/`, {
      responseType: 'blob' 
    });
  }
}
