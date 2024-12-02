import { CustomException } from './rest-api.exception-filter';

export class UserNotFoundException extends CustomException {
  constructor(message: string = 'User not found') {
    super(message);
    this.name = 'UserNotFoundException';
  }
}

export class EmailAlreadyTakenException extends CustomException {
  constructor(message: string) {
    super('Email is already taken: ' + message);
    this.name = 'EmailAlreadyTakenException';
  }
}
