import { userStub } from '../test/stubs/user.stub';

export const UserService = jest.fn().mockReturnValue({
  findUsers: jest.fn().mockResolvedValue([userStub()]),
  findUserById: jest.fn().mockResolvedValue(userStub()),
  createUser: jest.fn().mockResolvedValue(null),
  updateUser: jest.fn().mockResolvedValue(null),
  deleteUser: jest.fn().mockResolvedValue(null),
});
