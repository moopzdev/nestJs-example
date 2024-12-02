import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import {
  CustomException,
  EmailAlreadyTakenException,
  UserNotFoundException,
} from './users.exception';
import { Response } from 'express';

// @Catch(UserNotFoundException)
// export class UserNotFoundExceptionFilter implements ExceptionFilter {
//   catch(exception: UserNotFoundException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     response.status(404).json({
//       statusCode: 404,
//       message: exception.message,
//     });
//   }
// }

@Catch(CustomException)
export class GlobalExceptionFilter implements ExceptionFilter {
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
