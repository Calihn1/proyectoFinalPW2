import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Api } from '../../services/api';
import { Venta } from '../../models/venta.model';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-historial-ventas',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, FormsModule, RouterLink, RouterModule], 
  templateUrl: './historial-ventas.html',
  styleUrls: ['./historial-ventas.css']
})
export class HistorialVentas implements OnInit {

  ventas: Venta[] = [];
  isLoading = true;

  filtroAnio: number | null = null;
  filtroMes: number | null = null;
  filtroDia: number | null = null;

  opcionesAnio: number[] = [];
  opcionesMes: { valor: number, nombre: string }[] = [];
  opcionesDia: number[] = [];

  constructor(private api: Api) { }

  ngOnInit(): void {
    this.cargarVentas();
    this.inicializarOpcionesMes();
  }

  cargarVentas(params?: any): void {
    this.isLoading = true;
    let endpoint = '/ventas/';

    if (params) {
      const query = new URLSearchParams(params).toString();
      endpoint += `?${query}`;
    }

    this.api.get<Venta[]>(endpoint).subscribe({
      next: (data) => {
        this.ventas = data.map(venta => ({ ...venta, detallesVisibles: false }));
        if (!params) {
          this.generarOpcionesAnio();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el historial de ventas:', err);
        this.isLoading = false;
      }
    });
  }

  private generarOpcionesAnio(): void {
    const anios = this.ventas.map(v => new Date(v.fecha).getFullYear());
    this.opcionesAnio = [...new Set(anios)].sort((a, b) => b - a); 
  }

  private inicializarOpcionesMes(): void {
    this.opcionesMes = [
      { valor: 1, nombre: 'Enero' }, { valor: 2, nombre: 'Febrero' },
      { valor: 3, nombre: 'Marzo' }, { valor: 4, nombre: 'Abril' },
      { valor: 5, nombre: 'Mayo' }, { valor: 6, nombre: 'Junio' },
      { valor: 7, nombre: 'Julio' }, { valor: 8, nombre: 'Agosto' },
      { valor: 9, nombre: 'Septiembre' }, { valor: 10, nombre: 'Octubre' },
      { valor: 11, nombre: 'Noviembre' }, { valor: 12, nombre: 'Diciembre' }
    ];
  }

  onAnioChange(): void {
    this.filtroMes = null;
    this.filtroDia = null;
    this.opcionesDia = [];
  }

  onMesChange(): void {
    this.filtroDia = null;
    if (this.filtroAnio && this.filtroMes) {
      const diasEnMes = new Date(this.filtroAnio, this.filtroMes, 0).getDate();
      this.opcionesDia = Array.from({ length: diasEnMes }, (_, i) => i + 1);
    } else {
      this.opcionesDia = [];
    }
  }

  aplicarFiltro(): void {
    const params: any = {};
    if (this.filtroAnio) params.year = this.filtroAnio;
    if (this.filtroMes) params.month = this.filtroMes;
    if (this.filtroDia) params.day = this.filtroDia;

    this.cargarVentas(params);
  }

  limpiarFiltros(): void {
    this.filtroAnio = null;
    this.filtroMes = null;
    this.filtroDia = null;
    this.opcionesDia = [];
    this.cargarVentas(); 
  }

  toggleDetalles(ventaId: number): void {
    const venta = this.ventas.find(v => v.id === ventaId);
    if (venta) {
      venta.detallesVisibles = !venta.detallesVisibles;
    }
  }
}