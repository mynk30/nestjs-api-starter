import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    const message =
      typeof exceptionResponse === 'object'
        ? (exceptionResponse as any).message || exception.message
        : exceptionResponse;

    const duration = (request as any).startTime
      ? Date.now() - (request as any).startTime
      : 0;

    console.error(
      `[ERROR] ${request.method} ${request.url} ${status} - ${duration}ms - ${Array.isArray(message) ? message[0] : message}`,
    );

    const errorResponse = {
      success: false,
      error: {
        code: exception.name || 'INTERNAL_ERROR',
        message: Array.isArray(message) ? message[0] : message, // Handle validation error arrays
        statusCode: status,
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
      },

    };

    response.status(status).send(errorResponse);
  }
}
