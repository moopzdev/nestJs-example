import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { NextFunction, Request, Response } from 'express';
import { UserNotFoundException } from '../../exceptions/users.exception';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.cookies['userId'] as number;
    if (userId) {
      try {
        const user = await this.usersService.findOne(userId);
        Object.assign(req, { currentUser: user });
      } catch (error) {
        if (!(error instanceof UserNotFoundException)) {
          console.log(error);
        }
      }
    }
    next();
  }
}
