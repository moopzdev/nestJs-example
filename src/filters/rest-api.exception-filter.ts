import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  CustomException,
  EmailAlreadyTakenException,
  UserNotFoundException,
  UserNotSignedInException,
  WrongPasswordException,
} from '../exceptions/users.exception';

@Catch(CustomException)
export class RestApiExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: HttpStatus;

    switch (exception.constructor) {
      case UserNotFoundException:
        status = HttpStatus.NOT_FOUND;
        break;

      case EmailAlreadyTakenException:
        status = HttpStatus.BAD_REQUEST;
        break;

      case WrongPasswordException:
      case UserNotSignedInException:
        status = HttpStatus.UNAUTHORIZED;
        break;

      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
