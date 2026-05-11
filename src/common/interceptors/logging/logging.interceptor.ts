import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';

import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const now = Date.now();

    const req = context.switchToHttp().getRequest();

    const { method, url } = req;

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();

        console.log(
          `[SUCCESS] ${method} ${url} ${res.statusCode} - ${Date.now() - now}ms`,
        );
      }),

      catchError((err) => {
        const status =
          err instanceof HttpException
            ? err.getStatus()
            : 500;

        console.error(
          `[ERROR] ${method} ${url} ${status} - ${Date.now() - now}ms`,
        );

        console.error(err.message);

        return throwError(() => err);
      }),
    );
  }
}