import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { Csrf } from '../services/csrf';

export const CsrfInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  
  const csrfService = inject(Csrf);

  const token = csrfService.getToken();

  const methodsToInclude = ['POST', 'PUT', 'PATCH', 'DELETE'];

  let modifiedReq = req.clone({
    withCredentials: true
  });

  if (token && methodsToInclude.includes(req.method) && !req.headers.has('X-CSRFToken')) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        'X-CSRFToken': token
      }
    });
  }

  return next(modifiedReq);
};