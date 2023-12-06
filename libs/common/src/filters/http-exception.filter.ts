import { Response } from 'express';

import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as Record<string, unknown>;
    const message = exceptionResponse?.message;
    const error = exceptionResponse?.error;
    response.status(status).json({
      status,
      message,
      error
    });
  }
}
