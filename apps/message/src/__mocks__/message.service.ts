import { messageStub } from '../test/stubs/message.stub';

export const MessageService = jest.fn().mockReturnValue({
  findMessages: jest.fn().mockResolvedValue([messageStub()]),
  findMessage: jest.fn().mockResolvedValue(messageStub()),
  createMessage: jest.fn().mockResolvedValue(null),
  updateMessage: jest.fn().mockResolvedValue(null),
  acceptFriend: jest.fn().mockResolvedValue(null),
  deleteMessage: jest.fn().mockResolvedValue(null),
});
