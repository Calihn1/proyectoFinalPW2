export interface UserInfo {
  first_name: string;
  last_name: string;
}

export interface DetalleVenta {
  id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: string; 
  subtotal: string;       
}

export interface Venta {
  id: number;
  usuario: UserInfo;
  fecha: string;          
  descuento: string;      
  total_bruto: string;    
  total_neto: string;     
  detalles: DetalleVenta[];
  detallesVisibles?: boolean; 
}