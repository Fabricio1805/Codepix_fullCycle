import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { PixKeyAlreadyExistsError } from '../pix-keys.service';
import { Response } from 'express';

@Catch(PixKeyAlreadyExistsError)
export class PixKeyAlreadyExistsErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(422).json({
      statusCode: 422,
      message: exception.message,
    });
  }
}
