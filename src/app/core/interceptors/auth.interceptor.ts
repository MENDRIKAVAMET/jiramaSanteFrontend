import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ROUTES_CONFIG } from '../constants';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();
  const authReq = addToken(req, token);

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
        return handleTokenRefresh(req, next, auth);
      }
      return throwError(() => error);
    }),
  );
};

function addToken(req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return req;
}

function handleTokenRefresh(req: HttpRequest<unknown>, next: HttpHandlerFn, auth: AuthService) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshSubject.next(null);

    return auth.refreshToken().pipe(
      switchMap((tokens) => {
        isRefreshing = false;
        refreshSubject.next(tokens.accessToken);
        return next(addToken(req, tokens.accessToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        auth.logout().subscribe();
        inject(Router).navigateByUrl(ROUTES_CONFIG.login);
        return throwError(() => err);
      }),
    );
  }

  return refreshSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) => next(addToken(req, token))),
  );
}
