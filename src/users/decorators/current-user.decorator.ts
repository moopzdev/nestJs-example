import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../users.entity';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as Request & {
      currentUser: User;
    };
    return req.currentUser;
  },
);
