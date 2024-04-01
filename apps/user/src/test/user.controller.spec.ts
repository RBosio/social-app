import { Test } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { CreateUserDto, RmqService, UpdateUserDto, User } from '@app/common';
import { userStub } from './stubs/user.stub';
import { RmqContext } from '@nestjs/microservices';

jest.mock('../user.service');
describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  const mockContext = {} as unknown as RmqContext;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: RmqService,
          useValue: {
            acknowledgmentMessage: jest.fn().mockReturnValue(null),
          },
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('findUsers', () => {
    describe('when findUsers is called', () => {
      let users: User[] = [];

      beforeEach(async () => {
        users = await userController.findUsers(mockContext);
      });

      test('then it should call userService', () => {
        expect(userService.findUsers).toHaveBeenCalled();
      });

      test('then it should return users', () => {
        expect(users).toEqual([userStub()]);
      });
    });
  });

  describe('findUser', () => {
    describe('when findUser is called', () => {
      let user: User;

      beforeEach(async () => {
        user = await userController.findUser(mockContext, userStub().id);
      });

      test('then it should call userService', () => {
        expect(userService.findUserById).toHaveBeenCalledWith(userStub().id);
      });

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('createUser', () => {
    describe('when createUser is called', () => {
      const createUserDto: CreateUserDto = {
        name: userStub().name,
        email: userStub().email,
        password: userStub().password,
      };
      let response: string;

      beforeEach(async () => {
        response = await userController.createUser(mockContext, {
          userId: userStub().id,
          createUserDto,
        });
      });

      test('then it should call userService', () => {
        expect(userService.createUser).toHaveBeenCalledWith(
          userStub().id,
          createUserDto,
        );
      });

      test("then it should return 'user created!' message", () => {
        expect(response).toEqual('user created!');
      });
    });
  });

  describe('updateUser', () => {
    describe('when updateUser is called', () => {
      const updateUserDto: UpdateUserDto = {
        name: userStub().name,
      };
      let response;
      beforeEach(async () => {
        response = await userController.updateUser(mockContext, {
          userId: userStub().id,
          updateUserDto,
        });
      });

      test('then it should call userService', () => {
        expect(userService.updateUser).toHaveBeenCalledWith(
          userStub().id,
          updateUserDto,
        );
      });

      test("then it should return 'user updated!' message", () => {
        expect(response).toEqual('user updated!');
      });
    });
  });

  describe('deleteUser', () => {
    describe('when deleteUser is called', () => {
      let response: string;

      beforeEach(async () => {
        response = await userController.deleteUser(mockContext, userStub().id);
      });

      test('then it should call userService', () => {
        expect(userService.deleteUser).toHaveBeenCalledWith(userStub().id);
      });

      test("then it should return 'user deleted!' message", () => {
        expect(response).toEqual('user deleted!');
      });
    });
  });
});
