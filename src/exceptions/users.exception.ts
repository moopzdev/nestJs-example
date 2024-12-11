export abstract class CustomException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UserNotFoundException extends CustomException {
  constructor(message: string) {
    super('User not found: ' + message);
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

export class UserNotSignedInException extends CustomException {
  constructor(message: string = ' User not signed in') {
    super(message);
    this.name = 'UserNotSignedInException';
  }
}
