import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from '../users/users.entity';

export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      currentUser?: User;
    };
    const user = req.currentUser;
    if (!user) {
      throw new UnauthorizedException('User not signed in');
    }

    return user.isAdmin;
  }
}
