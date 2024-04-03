import { groupStub } from '../test/stubs/group.stub';

export const GroupService = jest.fn().mockReturnValue({
  findGroups: jest.fn().mockResolvedValue([groupStub()]),
  findGroup: jest.fn().mockResolvedValue(groupStub()),
  createGroup: jest.fn().mockResolvedValue(null),
  updateGroup: jest.fn().mockResolvedValue(null),
  acceptFriend: jest.fn().mockResolvedValue(null),
  deleteGroup: jest.fn().mockResolvedValue(null),
});
