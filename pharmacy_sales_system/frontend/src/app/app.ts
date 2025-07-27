import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Home } from './componentes/home/home';
import { Producto } from './services/producto';
import { Csrf } from './services/csrf';
import { Auth } from './services/auth'; 

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
    private auth: Auth     
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
  }
}