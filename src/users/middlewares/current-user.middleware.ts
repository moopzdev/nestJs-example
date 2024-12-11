import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.cookies['userId'] as number;
    if (userId) {
      const user = await this.usersService.findOne(userId);
      Object.assign(req, { currentUser: user });
    }
    next();
  }
}
