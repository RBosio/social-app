import { userStub } from '../../../user/src/test/stubs/user.stub';

export const AuthService = jest.fn().mockReturnValue({
  login: jest.fn().mockResolvedValue(userStub()),
  profile: jest.fn().mockResolvedValue(userStub()),
});
