import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AntiForgeryTokenService } from './anti-forgery-token.service';

export const antiForgeryInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(AntiForgeryTokenService);

  if (req.method === 'GET' && req.url.includes('/GetAntiForgeryToken')) {
    return next(req);
  }

  if (req.method !== 'GET') {
    return tokenService.getToken().pipe(
      switchMap((tokenData) => {
        const clonedRequest = req.clone({
          setHeaders: {
            [tokenData.headerName]: tokenData.token,
          },
        });
        return next(clonedRequest);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          tokenService.clearToken();
        }
        return throwError(() => error);
      }),
    );
  }

  return next(req);
};
