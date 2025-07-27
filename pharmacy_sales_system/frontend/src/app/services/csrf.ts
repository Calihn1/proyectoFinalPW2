import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class Csrf {
  private csrfToken: string | null = null;

  constructor(private http: HttpClient) {}

  fetchToken() {
    return this.http.get<{ csrfToken: string }>('https://proyectofinalpw2.onrender.com/api/csrf/', {
      withCredentials: true
    }).pipe(
      tap(response => {
        this.csrfToken = response.csrfToken;
      })
    );
  }

  getToken(): string | null {
    return this.csrfToken;
  }
}