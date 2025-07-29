import { Injectable, signal } from '@angular/core';
import { Api } from './api';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  readonly authenticated = signal(false); 
  private loggedIn = false;
  readonly user = signal<{ first_name: string; last_name: string; rol: string} | null>(null);

  constructor(private api: Api) {}

  login(credentials: { username: string; password: string }) {
    return this.api.post<any>('/login/', credentials).pipe(
      tap((user) => {
        this.loggedIn = true;
        this.authenticated.set(true);
        this.user.set(user);
      })
    );
  }

  logout() {
    return this.api.post<any>('/logout/', {}).pipe(
      tap(() => {
        this.loggedIn = false;
        this.authenticated.set(false);
      })
    );
  }

  checkAuth() {
    return this.api.get<any>('/check-user/').pipe(
      tap({
        next: (user) => {
          this.loggedIn = true;
          this.authenticated.set(true);
          this.user.set(user);
        },
        error: () => {
          this.loggedIn = false;
          this.authenticated.set(false);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}