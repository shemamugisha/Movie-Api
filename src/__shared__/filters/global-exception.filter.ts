import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const TAG = 'GlobalExceptionFilter';
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttp
      ? exception.getResponse()
      : exception.message;
    const error =
      typeof response === 'string'
        ? { message: exceptionResponse }
        : isHttp
        ? (exceptionResponse as Record<string, unknown>)
        : { message: exceptionResponse };
    Logger.error(`${request.url} ${request.method}`, exception.stack, TAG);
    response.status(status).json({
      ...this.formatError(error),
      timestamp: new Date().toISOString(),
    });
  }
  formatError(error: string | Record<string, unknown> | any): any {
    if (error.message && !Array.isArray(error.message)) {
      error.message = [error.message];
    }
    return error;
  }
}
