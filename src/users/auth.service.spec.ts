import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import {
  EmailAlreadyTakenException,
  UserNotFoundException,
  WrongPasswordException,
} from '../exceptions/users.exception';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //create in-memory user storage
    const users: User[] = [];
    //create fake copy of user service
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email == email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    //creating module for testing
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('signup', () => {
    it('can create an instance of AuthService', async () => {
      expect(service).toBeDefined();
    });

    it('should create new user with salted and hashed password', async () => {
      const user = await service.signup('test@test.com', '1234');
      expect(user.password).not.toEqual('1234');
      const [salt, hash] = user.password.split('.');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('should throw an error if email is already taken', async () => {
      await service.signup('something@a.com', 'testPassword');
      await expect(service.signup('something@a.com', '1234')).rejects.toThrow(
        EmailAlreadyTakenException,
      );
    });
  });
  describe('signin', () => {
    it('should throw if signin is called with unused email', () => {
      expect(service.signin('something@a.com', '2345')).rejects.toThrow(
        UserNotFoundException,
      );
    });
    it('should throw if invalid password is provided', async () => {
      await service.signup('something@a.com', 'testPassword');
      expect(service.signin('something@a.com', 'mockPassword')).rejects.toThrow(
        WrongPasswordException,
      );
    });
    it('should return a user if correct password is provided', async () => {
      await service.signup('testmail@mail.com', 'testPassword');
      const user = await service.signin('testmail@mail.com', 'testPassword');
      expect(user).toBeDefined();
    });
  });
});
