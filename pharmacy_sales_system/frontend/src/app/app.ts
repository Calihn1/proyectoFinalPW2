import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Home } from './componentes/home/home';
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
    private csrf: Csrf,
    private auth: Auth,  
  ) {}

  ngOnInit(): void {
    this.csrf.fetchToken().subscribe({
      next: () => console.log('Token CSRF obtenido y guardado'),
      error: () => console.error('Error al obtener token CSRF')
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