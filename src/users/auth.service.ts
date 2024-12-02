import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { EmailAlreadyTakenException } from './users.exception';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userSService: UsersService) {}

  async signup(email: string, password: string) {
    //See if email is in use
    const users = await this.userSService.find(email);
    if (users.length) {
      throw new EmailAlreadyTakenException(email);
    }

    //generate a salt
    const salt = randomBytes(8).toString('hex');

    //add salt to password and hash
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //join the hashed result and salt together

    const result = salt + '.' + hash.toString('hex');

    //create new user and save it
    const user = this.userSService.create(email, result);

    return user;
  }

  signin() {}
}
