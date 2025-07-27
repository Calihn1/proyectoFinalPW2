import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Home } from './componentes/home/home';
import { Producto } from './services/producto';
import { Csrf } from './services/csrf';
import { Auth } from './services/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Home, CurrencyPipe],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  title = 'frontend';

  constructor(
    private producto: Producto,
    private csrf: Csrf,
    private auth: Auth,
    private http: HttpClient    
  ) {}

  ngOnInit(): void {
    // Obtener token CSRF al iniciar
    this.csrf.getToken().subscribe({
      next: (res: any) => {
        console.log('Token CSRF recibido:', res.csrfToken);
        console.log('Cookies actuales:', document.cookie);
      },
      error: (err: any) => {
        console.error('Error al obtener token CSRF', err);
      }
    });

    this.auth.checkAuth().subscribe({
      next: () => {
        console.log('Usuario autenticado');
      },
      error: () => {
        console.log('Usuario no autenticado o sesión expirada');
      }
    });

    this.http.get('https://proyectofinalpw2.onrender.com/api/test-cookies/', { withCredentials: true })
      .subscribe({
        next: (res) => console.log('Respuesta cookies:', res),
        error: (err) => console.error('Error test cookies:', err),
      });
  }
}