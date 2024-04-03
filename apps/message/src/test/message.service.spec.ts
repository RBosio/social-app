import { Test } from '@nestjs/testing';
import { MessageService } from '../message.service';
import { messageStub } from './stubs/message.stub';
import { CreateMessageDto, Message, MessageRepository } from '@app/common';
import { UserService } from '../../../user/src/user.service';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import { groupStub } from '../../../group/src/test/stubs/group.stub';
import { userStub } from '../../../user/src/test/stubs/user.stub';
import { GroupService } from '../../../group/src/group.service';

jest.mock('../../../user/src/user.service');
jest.mock('../../../group/src/group.service');
describe('MessageService', () => {
  let messageService: MessageService;
  let messageRepository: MessageRepository;
  let userService: UserService;
  let groupService: GroupService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: 'MessageRepository',
          useValue: {
            findAll: jest.fn().mockResolvedValue([messageStub()]),
            findOneById: jest.fn().mockResolvedValue(messageStub()),
            create: jest.fn().mockReturnValue(messageStub()),
            save: jest.fn().mockResolvedValue(null),
            delete: jest.fn().mockResolvedValue(null),
          },
        },
        UserService,
        GroupService,
      ],
    }).compile();

    messageService = moduleRef.get<MessageService>(MessageService);
    messageRepository = moduleRef.get<MessageRepository>('MessageRepository');
    userService = moduleRef.get<UserService>(UserService);
    groupService = moduleRef.get<GroupService>(GroupService);
  });

  describe('findMessage', () => {
    describe('when findMessage is called', () => {
      let message: Message;

      beforeEach(async () => {
        message = await messageService.findMessage(messageStub().id);
      });

      test('then it should call messageRepository', () => {
        expect(messageRepository.findOneById).toHaveBeenCalledWith(
          messageStub().id,
        );
      });

      test('then it should return message', () => {
        expect(message).toEqual(messageStub());
      });
    });

    describe('when findMessage is called and message no exist', () => {
      test('then it should throw rpc exception', async () => {
        jest
          .spyOn(messageRepository, 'findOneById')
          .mockResolvedValueOnce(null);

        await expect(
          messageService.findMessage(messageStub().id),
        ).rejects.toThrow(RpcException);
      });
    });
  });

  describe('createMessage', () => {
    describe('when createMessage is called', () => {
      const createMessageDto: CreateMessageDto = {
        groupId: groupStub().id,
        userId: userStub().id,
        message: 'Hello, World!',
      };
      let response;

      beforeEach(async () => {
        response = await messageService.createMessage(
          messageStub().id,
          createMessageDto,
        );
      });

      test('then it should call messageRepository', () => {
        expect(messageRepository.create).toHaveBeenCalledWith(createMessageDto);
      });

      test('then it should return undefined', () => {
        expect(response).toEqual(undefined);
      });
    });

    describe('when createMessage is called and user not found', () => {
      test('then it should throw rpc exception', async () => {
        const createMessageDto: CreateMessageDto = {
          groupId: groupStub().id,
          userId: userStub().id,
          message: 'Hello, World!',
        };
        jest.spyOn(userService, 'findUserById').mockRejectedValueOnce(
          new RpcException({
            message: 'user not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );

        await expect(
          messageService.createMessage(messageStub().id, createMessageDto),
        ).rejects.toThrow(RpcException);
      });
    });

    describe('when createMessage is called and group not found', () => {
      test('then it should throw rpc exception', async () => {
        const createMessageDto: CreateMessageDto = {
          groupId: groupStub().id,
          userId: userStub().id,
          message: 'Hello, World!',
        };
        jest.spyOn(groupService, 'findGroup').mockRejectedValueOnce(
          new RpcException({
            message: 'user not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );

        await expect(
          messageService.createMessage(messageStub().id, createMessageDto),
        ).rejects.toThrow(RpcException);
      });
    });
  });

  describe('deleteMessage', () => {
    describe('when deleteMessage is called', () => {
      let response;

      beforeEach(async () => {
        response = await messageService.deleteMessage(messageStub().id);
      });

      test('then it should call messageRepository', () => {
        expect(messageRepository.delete).toHaveBeenCalledWith(messageStub().id);
      });

      test('then it should return undefined', () => {
        expect(response).toEqual(undefined);
      });
    });

    describe('when deleteMessage is called and message no exist', () => {
      test('then it should throw rpc exception', async () => {
        jest.spyOn(messageService, 'findMessage').mockRejectedValueOnce(
          new RpcException({
            message: 'message not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );
        await expect(
          messageService.deleteMessage(messageStub().id),
        ).rejects.toThrow(RpcException);
      });
    });
  });
});
