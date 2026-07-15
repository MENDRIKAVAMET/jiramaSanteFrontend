import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();

  return next(req).pipe(
    finalize(() => {
      const elapsed = Date.now() - startTime;
      console.debug(`[HTTP] ${req.method} ${req.urlWithParams} — ${elapsed}ms`);
    }),
  );
};
