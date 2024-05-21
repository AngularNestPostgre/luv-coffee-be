import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { TypeORMError } from 'typeorm';
import { Response } from 'express';

@Catch(TypeORMError)
export class TypeormExceptionFilter<T extends TypeORMError>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.UNPROCESSABLE_ENTITY;

    Logger.error(
      exception.message,
      (exception as any).stack,
      `${request.method} ${request.url}`,
    );

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      code: (exception as any).code,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });
  }
}
