import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UserNotFoundException } from '../exceptions/users.exception';
import { Response } from 'express';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne(id: number) {
        return Promise.resolve({
          id,
          email: 'test@mail.com',
          password: 'pwd',
        } as User);
      },
      find(email) {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: 'pwd',
          } as User,
        ]);
      },
    };
    fakeAuthService = {
      signin(email, password) {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('findUsers', () => {
    it('return list of users with given email', async () => {
      const users = await controller.findUsers('aaa@mail.com');
      expect(users.length).toEqual(1);
    });
  });
  describe('findUser', () => {
    it('should return single user with given id', async () => {
      const user = await controller.findUser(11);
      expect(user).toBeDefined();
    });
    it('should throw if user not found', async () => {
      fakeUsersService.findOne = jest
        .fn()
        .mockRejectedValue(new UserNotFoundException('11'));
      expect(controller.findUser(11)).rejects.toThrow(UserNotFoundException);
    });
  });
  describe('signin', () => {
    it('should update session object an returns user', async () => {
      // normally I would condemn this shameless type casting but it is okay for the purpose of unittesting
      const response = {
        cookie: jest.fn(() => {
          return response;
        }),
        status: jest.fn(() => {
          return response;
        }),
      } as unknown as Response;
      const user = await controller.signin(
        { email: 'test@mail.com', password: 'pwd' },
        response,
      );
      expect(user.id).toEqual(1);
      expect(response.cookie).toHaveBeenCalledWith('userId', 1);
    });
  });
});
