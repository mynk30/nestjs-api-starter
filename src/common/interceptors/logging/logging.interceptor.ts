import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';

import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();


    const { method, url } = req;

    return next.handle().pipe(
      tap(() => {
        const duration = req.startTime
          ? Date.now() - req.startTime
          : 0;

        console.log(
          `[SUCCESS] ${method} ${url} ${res.statusCode} - ${duration}ms`,
        );
      })
    );
  }
}