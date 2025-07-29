import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../../services/producto';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Navbar } from '../navbar/navbar';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { Venta, VentaD, VentaCreada } from '../../services/venta';
import { ModalInforme } from '../modal-informe/modal-informe';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, FormsModule, Navbar, ModalInforme],
  templateUrl: 'home.html',
  styleUrl: 'home.css'
})
export class Home implements OnInit {
  productos: any[] = [];
  carrito: any[] = [];
  total: number = 0;
  codigoInput: string = '';
  descuento: number = 0;
  totalNeto: number = 0;
  totalBruto: number = 0;
  ultimaVentaId: number | null = null;
  carritoVendido: any[] = [];
  ventaBruto: number = 0;
  ventaDescuento: number = 0;
  ventaNeto: number = 0;

  constructor(
    private productoService: Producto,
    private auth: Auth,
    private ventaService: Venta
  ) {}
    
  ngOnInit(): void {
    this.productoService.listarProductos().subscribe(data => {
      this.productos = data;
    });
  }

  get currentUser() {
    return this.auth.user();
  }

  escanearProducto() {
    if (this.ultimaVentaId !== null) {
        this.ultimaVentaId = null;
        this.carritoVendido = [];
        this.ventaBruto = 0;
        this.ventaDescuento = 0;
        this.ventaNeto = 0;
    }

    const codigo = this.codigoInput.trim();
    if (!codigo) return;

    const producto = this.productos.find(p => p.codigo == codigo || p.id == codigo);
    if (!producto) {
      alert('Producto no encontrado');
      return;
    }

    if (producto.cantidad <= 0) {
      alert('No hay suficiente stock');
      return;
    }

    const itemCarrito = this.carrito.find(p => p.id == producto.id);
    if (itemCarrito) {
      if (itemCarrito.cantidad < producto.cantidad) {
        itemCarrito.cantidad += 1;
      } else {
        alert('No hay suficiente stock para agregar más');
      }
    } else {
      this.carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: Number(producto.precio),
        cantidad: 1
      });
    }

    this.calcularTotal();
    this.codigoInput = '';
  }

  calcularTotal() {
    this.totalBruto = this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const montoDescuento = this.totalBruto * (this.descuento / 100);
    this.totalNeto = this.totalBruto - montoDescuento;
  }
  
  resetearCarrito() {
    this.carrito = [];
    this.descuento = 0;
    this.calcularTotal();
  }

  eliminarItem(item: any) {
    this.carrito = this.carrito.filter(p => p.id !== item.id);
    this.calcularTotal();
  }

  agregarDescuento() {
    const inputDescuento = prompt('Ingrese el porcentaje de descuento (0-100):', this.descuento.toString());
    
    if (inputDescuento === null) return;

    const nuevoDescuento = parseFloat(inputDescuento);

    if (isNaN(nuevoDescuento) || nuevoDescuento < 0 || nuevoDescuento > 100) {
      alert('Por favor, ingrese un número válido entre 0 y 100.');
      return;
    }

    this.descuento = nuevoDescuento;
    this.calcularTotal();
  }

  procederCompra(): void {
    if (this.carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    const ventaData: VentaD = {
      descuento: this.descuento,
      detalles: this.carrito.map(item => ({
        producto: item.id,
        cantidad: item.cantidad
      }))
    };

    this.ventaService.crearVenta(ventaData).subscribe({
      next: (ventaCreada: VentaCreada) => {
        alert(`Venta #${ventaCreada.id} realizada con éxito!`);
        this.ultimaVentaId = ventaCreada.id;
        this.carritoVendido = [...this.carrito];
        this.ventaBruto = this.totalBruto;
        this.ventaDescuento = this.descuento;
        this.ventaNeto = this.totalNeto;
        this.resetearCarrito();
        this.productoService.listarProductos().subscribe(data => this.productos = data);
      },
      error: (err) => {
        console.error('Error al crear la venta:', err);
        const errorMessage = err.error?.detail ?? 'No se pudo procesar la venta. Verifique el stock o inténtelo más tarde.';
        alert(`Error: ${errorMessage}`);
      }
    });
  }

  generarComprobante(): void {
    if (this.carritoVendido.length === 0) {
      alert('Primero debe completar una compra para generar el comprobante.');
      return;
    }
    
    const currentUser = this.currentUser; 
    if (!currentUser) {
      alert('Sesión de vendedor no encontrada. No se puede generar el comprobante.');
      return;
    }

    const nombreCliente = prompt("Ingrese el nombre del cliente:", "Cliente Varios");
    if (nombreCliente === null) {
      return;
    }

    const direccionCliente = prompt("Ingrese la dirección del cliente (opcional):");
    const correoCliente = prompt("Ingrese el correo del cliente (opcional):");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Tu Farma S.A.C.', 20, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Factura N° ${String(this.ultimaVentaId).padStart(5, '0')}`, pageWidth - 20, 30, { align: 'right' });
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, pageWidth - 20, 37, { align: 'right' });
    doc.setLineWidth(0.5);
    doc.line(20, 45, pageWidth - 20, 45);
    doc.setFontSize(11);
    doc.text(`Cliente: ${nombreCliente || 'Cliente Varios'}`, 20, 55);
    doc.text(`Dirección: ${direccionCliente || ''}`, 20, 62);
    doc.text(`Vendedor: ${currentUser.first_name} ${currentUser.last_name}`, pageWidth / 2 + 10, 55);
    doc.text(`Correo: ${correoCliente || ''}`, pageWidth / 2 + 10, 62);
    doc.line(20, 70, pageWidth - 20, 70);
    autoTable(doc, {
      head: [['CANTIDAD', 'PRODUCTO', 'PRECIO', 'TOTAL']],
      body: this.carritoVendido.map(item => [
        item.cantidad,
        item.nombre,
        `S/ ${Number(item.precio).toFixed(2)}`,
        `S/ ${(Number(item.precio) * item.cantidad).toFixed(2)}`
      ]),
      startY: 75,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 255, 255], textColor: [0, 0, 0],
        fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.2
      },
      styles: { lineColor: [0, 0, 0], lineWidth: 0.2 },
      columnStyles: {
        0: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' }
      }
    });
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Subtotal: S/ ${this.ventaBruto.toFixed(2)}`, pageWidth - 20, finalY + 15, { align: 'right' });
    if (this.ventaDescuento > 0) {
      const montoDescuento = this.ventaBruto * (this.ventaDescuento / 100);
      doc.text(`Descuento (${this.ventaDescuento}%): - S/ ${montoDescuento.toFixed(2)}`, pageWidth - 20, finalY + 22, { align: 'right' });
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: S/ ${this.ventaNeto.toFixed(2)}`, pageWidth - 20, finalY + 30, { align: 'right' });
    doc.output('dataurlnewwindow');
  }
}