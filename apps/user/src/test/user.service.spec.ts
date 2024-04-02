import { Test } from '@nestjs/testing';
import { UserService } from '../user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserRepository,
} from '@app/common';
import { userStub } from './stubs/user.stub';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';
import { HttpStatus } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useValue: {
            findAll: jest.fn().mockResolvedValue([userStub()]),
            findOneById: jest.fn().mockResolvedValue(userStub()),
            findOneByEmail: jest.fn().mockResolvedValue(userStub()),
            create: jest.fn().mockResolvedValue(null),
            save: jest.fn().mockResolvedValue(null),
            delete: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>('UserRepository');
  });

  test('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('findUsers', () => {
    let users: User[];

    describe('when findUsers is called', () => {
      beforeEach(async () => {
        users = await userService.findUsers();
      });

      test('then it should call userRepository', () => {
        expect(userRepository.findAll).toHaveBeenCalled();
      });

      test('then it should return users', () => {
        expect(users).toEqual([userStub()]);
      });
    });
  });

  describe('findUserById', () => {
    describe('when findUserById is called', () => {
      let user: User;

      beforeEach(async () => {
        user = await userService.findUserById(userStub().id);
      });

      test('then it should call userRepository', () => {
        expect(userRepository.findOneById).toHaveBeenCalledWith(userStub().id, {
          posts: true,
          groups: true,
        });
      });

      test('then it should return user', () => {
        expect(user).toEqual(userStub());
      });
    });

    describe("when findUserById is called and user doesn't exist", () => {
      test('then it should throw a rpc exception', async () => {
        jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(null);

        await expect(userService.findUserById(userStub().id)).rejects.toThrow(
          RpcException,
        );
      });
    });
  });

  describe('findUserByEmail', () => {
    describe('when findUserByEmail is called', () => {
      let user: User;

      beforeEach(async () => {
        user = await userService.findUserByEmail(userStub().email);
      });

      test('then it should call userRepository', () => {
        expect(userRepository.findOneByEmail).toHaveBeenCalledWith(
          userStub().email,
        );
      });

      test('then it should return user', () => {
        expect(user).toEqual(userStub());
      });
    });

    describe("when findUserByEmail is called and user doesn't exist", () => {
      test('then it should return null', async () => {
        jest
          .spyOn(userRepository, 'findOneByEmail')
          .mockResolvedValueOnce(null);
        const user = await userService.findUserByEmail(userStub().email);

        expect(user).toEqual(null);
      });
    });
  });

  describe('createUser', () => {
    describe('when createUser is called', () => {
      let response;

      beforeEach(async () => {
        const createUserDto: CreateUserDto = {
          email: userStub().email,
          name: userStub().name,
          password: userStub().password,
        };
        jest
          .spyOn(userRepository, 'findOneByEmail')
          .mockResolvedValueOnce(null);
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(userStub().password);

        response = await userService.createUser(userStub().id, createUserDto);
      });

      test('then it should call userRepository', () => {
        expect(userRepository.create).toHaveBeenCalled();
      });

      test('then it should return undefined', () => {
        expect(response).toEqual(undefined);
      });
    });

    describe('when createUser is called and email already exists', () => {
      test('then it should throw a rpc exception', async () => {
        const createUserDto: CreateUserDto = {
          email: userStub().email,
          name: userStub().name,
          password: userStub().password,
        };

        await expect(
          userService.createUser(userStub().id, createUserDto),
        ).rejects.toThrow(RpcException);
      });
    });
  });

  describe('updateUser', () => {
    describe('when updateUser is called', () => {
      let response;

      beforeEach(async () => {
        const updateUserDto: UpdateUserDto = {
          name: userStub().name,
          password: userStub().password,
        };
        jest
          .spyOn(userService, 'findUserById')
          .mockResolvedValueOnce(userStub());

        response = await userService.updateUser(userStub().id, updateUserDto);
      });

      test('then it should call findUserById', () => {
        expect(userService.findUserById).toHaveBeenCalledWith(userStub().id);
      });

      test('then it should call userRepository', () => {
        expect(userRepository.save).toHaveBeenCalledWith(userStub());
      });
    });

    describe('when updateUser is called and user not found', () => {
      test('then it should throw a rpc excecption', async () => {
        const updateUserDto: UpdateUserDto = {
          name: userStub().name,
          password: userStub().password,
        };
        jest.spyOn(userService, 'findUserById').mockRejectedValueOnce(
          new RpcException({
            message: 'user not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );

        await expect(
          userService.updateUser(userStub().id, updateUserDto),
        ).rejects.toThrow(RpcException);
      });
    });
  });

  describe('deleteUser', () => {
    describe('when deleteUser is called', () => {
      let response;

      beforeEach(async () => {
        jest
          .spyOn(userService, 'findUserById')
          .mockResolvedValueOnce(userStub());
        response = await userService.deleteUser(userStub().id);
      });

      test('then it should call userRepository', () => {
        expect(userRepository.delete).toHaveBeenCalledWith(userStub().id);
      });

      test('then it should return undefined', () => {
        expect(response).toEqual(undefined);
      });
    });

    describe('when deleteUser is called and user not found', () => {
      test('then it should throw a rpc excecption', async () => {
        jest.spyOn(userService, 'findUserById').mockRejectedValueOnce(
          new RpcException({
            message: 'user not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );

        await expect(userService.deleteUser(userStub().id)).rejects.toThrow(
          RpcException,
        );
      });
    });
  });
});
