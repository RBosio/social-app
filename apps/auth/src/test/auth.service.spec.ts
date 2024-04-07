import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { LoginUserDto, User } from '@app/common';
import { UserService } from '../../../user/src/user.service';
import { userStub } from '../../../user/src/test/stubs/user.stub';
import { loginStub } from './stubs/auth.stub';
import * as bcrypt from 'bcryptjs';
import { RpcException } from '@nestjs/microservices';

jest.mock('../../../user/src/user.service');
describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService, UserService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('login', () => {
    describe('when login is called', () => {
      let user: User;
      const loginUserDto: LoginUserDto = {
        email: loginStub().email,
        password: loginStub().password,
      };

      beforeEach(async () => {
        const bcryptCompare = jest.fn().mockResolvedValue(true);
        (bcrypt.compare as jest.Mock) = bcryptCompare;
        user = await authService.login(loginUserDto);
      });

      test('then it should call userService', () => {
        expect(userService.findUserByEmail).toHaveBeenCalledWith(
          loginUserDto.email,
        );
      });

      test('then it should return user', () => {
        expect(user).toEqual(userStub());
      });
    });

    describe('when login is called and email wrong', () => {
      let user: User;
      const loginUserDto: LoginUserDto = {
        email: loginStub().email,
        password: loginStub().password,
      };

      test('then it should throw rpc exception', async () => {
        jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(undefined);
        const bcryptCompare = jest.fn().mockResolvedValue(true);
        (bcrypt.compare as jest.Mock) = bcryptCompare;

        await expect(authService.login(loginUserDto)).rejects.toThrow(
          RpcException,
        );
      });
    });

    describe('when login is called and password wrong', () => {
      let user: User;
      const loginUserDto: LoginUserDto = {
        email: loginStub().email,
        password: loginStub().password,
      };

      test('then it should throw rpc exception', async () => {
        const bcryptCompare = jest.fn().mockResolvedValue(false);
        (bcrypt.compare as jest.Mock) = bcryptCompare;

        await expect(authService.login(loginUserDto)).rejects.toThrow(
          RpcException,
        );
      });
    });
  });

  describe('profile', () => {
    describe('when profile is called', () => {
      let user: User;

      beforeEach(async () => {
        user = await authService.profile(userStub().id);
      });

      test('then it should call userService', () => {
        expect(userService.findUserById).toHaveBeenCalledWith(userStub().id);
      });

      test('then it should return user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });
});
