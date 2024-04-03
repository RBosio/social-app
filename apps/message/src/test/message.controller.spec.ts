import { Test } from '@nestjs/testing';
import { MessageController } from '../message.controller';
import { MessageService } from '../message.service';
import { CreateMessageDto, RmqService } from '@app/common';
import { RmqContext } from '@nestjs/microservices';
import { messageStub } from './stubs/message.stub';
import { groupStub } from '../../../group/src/test/stubs/group.stub';
import { userStub } from '../../../user/src/test/stubs/user.stub';

jest.mock('../message.service');
describe('MessageController', () => {
  let messageController: MessageController;
  let messageService: MessageService;
  const mockContext = {} as unknown as RmqContext;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        MessageService,
        {
          provide: RmqService,
          useValue: {
            acknowledgmentMessage: jest.fn().mockReturnValue(null),
          },
        },
      ],
    }).compile();

    messageController = app.get<MessageController>(MessageController);
    messageService = app.get<MessageService>(MessageService);
  });

  test('should be defined', () => {
    expect(messageController).toBeDefined();
    expect(messageService).toBeDefined();
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
        response = await messageController.createMessage(mockContext, {
          messageId: messageStub().id,
          createMessageDto,
        });
      });

      test('then it should call messageService', () => {
        expect(messageService.createMessage).toHaveBeenCalledWith(
          messageStub().id,
          createMessageDto,
        );
      });

      test('then it should return "message created!"', () => {
        expect(response).toEqual('message created!');
      });
    });
  });

  describe('deleteMessage', () => {
    describe('when deleteMessage is called', () => {
      let response;

      beforeEach(async () => {
        response = await messageController.deleteMessage(
          mockContext,
          messageStub().id,
        );
      });

      test('then it should call messageService', () => {
        expect(messageService.deleteMessage).toHaveBeenCalledWith(
          messageStub().id,
        );
      });

      test('then it should return "message deleted!"', () => {
        expect(response).toEqual('message deleted!');
      });
    });
  });
});
