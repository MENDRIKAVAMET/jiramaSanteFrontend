import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ROUTES_CONFIG } from '../constants';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.clearSession();
        router.navigateByUrl(ROUTES_CONFIG.login);
      } else if (error.status === 403) {
        router.navigateByUrl(ROUTES_CONFIG.forbidden);
      }

      return throwError(() => error);
    }),
  );
};
