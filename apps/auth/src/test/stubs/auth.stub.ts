import { LoginUserDto } from '@app/common';
import { userStub } from '../../../../user/src/test/stubs/user.stub';

export const loginStub = (): LoginUserDto => {
  return {
    email: userStub().email,
    password: userStub().password,
  };
};
