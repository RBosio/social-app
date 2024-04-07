import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginUserDto, RmqService, User } from '@app/common';
import { RmqContext } from '@nestjs/microservices';
import { loginStub } from './stubs/auth.stub';
import { userStub } from '../../../user/src/test/stubs/user.stub';

jest.mock('../auth.service');
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  const mockContext = {} as unknown as RmqContext;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: RmqService,
          useValue: {
            acknowledgmentMessage: jest.fn().mockReturnValue(null),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('login', () => {
    describe('when login is called', () => {
      const loginUserDto: LoginUserDto = {
        email: loginStub().email,
        password: loginStub().password,
      };
      let user: User;

      beforeEach(async () => {
        user = await authController.login(mockContext, loginUserDto);
      });

      test('then it should call authService', () => {
        expect(authService.login).toHaveBeenCalledWith(loginUserDto);
      });

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('profile', () => {
    describe('when profile is called', () => {
      const userId = userStub().id;
      let user: User;

      beforeEach(async () => {
        user = await authController.profile(mockContext, userId);
      });

      test('then it should call authService', () => {
        expect(authService.profile).toHaveBeenCalledWith(userId);
      });

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });
});
