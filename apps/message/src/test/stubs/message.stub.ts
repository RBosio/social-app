import { Message } from '@app/common';
import { groupStub } from '../../../../group/src/test/stubs/group.stub';
import { userStub } from '../../../../user/src/test/stubs/user.stub';

export const messageStub = (): Message => {
  return {
    id: 'caf387ef-188f-499c-9255-77244a07b232',
    created_at: new Date('2024-04-03T00:00:00'),
    deleted_at: null,
    group: groupStub(),
    message: 'Hello, World!',
    user: userStub(),
  };
};
