import { CustomException } from './rest-api.exception-filter';

export class UserNotFoundException extends CustomException {
  constructor(message: string = 'User not found') {
    super(message);
    this.name = 'UserNotFoundException';
  }
}

export class EmailAlreadyTakenException extends CustomException {
  constructor(email: string) {
    super('Email is already taken: ' + email);
    this.name = 'EmailAlreadyTakenException';
  }
}

export class WrongPasswordException extends CustomException {
  constructor(message: string = 'Passwords do not match') {
    super(message);
    this.name = 'WrongPasswordException';
  }
}
