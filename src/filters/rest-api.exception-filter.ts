import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import {
  EmailAlreadyTakenException,
  UserNotFoundException,
} from './users.exception';

export class CustomException extends Error {
  constructor(message: string) {
    super(message);
  }
}

@Catch(CustomException)
export class RestApiExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    let statusCode = 500;
    switch (exception.constructor) {
      case UserNotFoundException:
        statusCode = 404;
      case EmailAlreadyTakenException:
        statusCode = 400;
      default:
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        response.status(statusCode).json({
          statusCode: statusCode,
          message: exception.message,
        });
    }
  }
}
