import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { Chart, ChartType, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { Api } from '../../services/api';

interface ProductoInfo {
  nombre: string;
  cantidad: number;
  stock_minimo: number;
}

interface ChartData {
  labels: string[];
  datasets: { data: number[]; label: string; }[];
}

interface StockStatus {
  status: 'suficiente' | 'bajo' | 'critico' | 'agotado';
  count: number;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, NgChartsModule, RouterModule],
  templateUrl: './estadisticas.html',
  styleUrls: ['./estadisticas.css']
})
export class Estadisticas implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public lineChartType: ChartType = 'line';
  public lineChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y'
  };

  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  public stockCounts = { suficiente: 0, bajo: 0, critico: 0, agotado: 0 };

  public modalTitulo = '';
  public productosModal: ProductoInfo[] = [];
  public isLoadingModal = false;

  constructor(private api: Api) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.cargarVentasPorFecha('daily');
    this.cargarTopProductos('facturacion');
    this.cargarStockStatus();
  }

  verDetalleStock(estado: StockStatus['status']): void {
    this.productosModal = [];
    this.isLoadingModal = true;

    const titulos: Record<StockStatus['status'], string> = {
      suficiente: 'Productos con Stock Suficiente',
      bajo: 'Productos con Stock Bajo',
      critico: 'Productos con Stock Crítico',
      agotado: 'Productos Agotados'
    };
    this.modalTitulo = titulos[estado];

    this.api.get<ProductoInfo[]>(`/estadisticas/productos-por-estado/?estado=${estado}`).subscribe({
      next: (data) => {
        this.productosModal = data;
        this.isLoadingModal = false;
      },
      error: (err) => {
        console.error(`Error al cargar productos con estado ${estado}`, err);
        this.isLoadingModal = false;
      }
    });
  }

  cargarVentasPorFecha(periodo: string): void {
    this.api.get<ChartData>(`/estadisticas/ventas-por-fecha/?periodo=${periodo}`).subscribe(data => {
      this.lineChartData = {
        ...data,
        datasets: data.datasets.map(ds => ({
          ...ds,
          fill: 'origin',
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.3
        }))
      };
      this.chart?.update();
    });
  }

  cargarTopProductos(metrica: string): void {
    this.api.get<ChartData>(`/estadisticas/top-productos/?metrica=${metrica}`).subscribe(data => {
      this.barChartData = {
        ...data,
        datasets: data.datasets.map(ds => ({
          ...ds,
          backgroundColor: '#10b981'
        }))
      };
      this.chart?.update();
    });
  }

  cargarStockStatus(): void {
    this.api.get<StockStatus[]>(`/estadisticas/stock-status/`).subscribe(data => {
      this.stockCounts = { suficiente: 0, bajo: 0, critico: 0, agotado: 0 };
      data.forEach(item => this.stockCounts[item.status] = item.count);

      this.doughnutChartData = {
        labels: ['Suficiente', 'Bajo', 'Crítico', 'Agotado'],
        datasets: [{
          data: [
            this.stockCounts.suficiente,
            this.stockCounts.bajo,
            this.stockCounts.critico,
            this.stockCounts.agotado,
          ],
          backgroundColor: ['#22c55e', '#facc15', '#ef4444', '#6b7280'],
          hoverBackgroundColor: ['#16a34a', '#eab308', '#dc2626', '#4b5563'],
          borderWidth: 1
        }]
      };
      this.chart?.update();
    });
  }
}
