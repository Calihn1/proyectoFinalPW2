import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { catchError, map, of } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.checkAuth().pipe(
    map(() => true), 
    catchError(() => {
      router.navigate(['/']);
      return of(false);
    })
  );
};