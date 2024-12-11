import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import {
  EmailAlreadyTakenException,
  UserNotFoundException,
  WrongPasswordException,
} from '../exceptions/users.exception';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    //See if email is in use
    const users = await this.userService.find(email);
    if (users.length) {
      throw new EmailAlreadyTakenException(email);
    }
    //generate a salt
    const salt = randomBytes(8).toString('hex');
    //add salt to password and hash
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //join the hashed result and salt together
    const result = salt + '.' + hash.toString('hex');
    //create new user; save it; return
    return this.userService.create(email, result);
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new UserNotFoundException(email);
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new WrongPasswordException();
    }
    return user;
  }
}
