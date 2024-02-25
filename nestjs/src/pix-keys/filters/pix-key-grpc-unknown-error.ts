import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { PixKeyGrpcUnknowError } from '../pix-keys.service';
import { Response } from 'express';

@Catch(PixKeyGrpcUnknowError)
export class PixKeyGrpcUnknownErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(500).json({
      statusCode: 500,
      message: exception.message,
    });
  }
}
