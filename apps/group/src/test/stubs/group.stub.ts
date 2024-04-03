import { Group } from '@app/common';

export const groupStub = (): Group => {
  return {
    id: 'caf387ef-188f-499c-9255-77244a07b232',
    name: 'group name',
    status: 'requested',
    created_at: new Date('2024-04-03T00:00:00'),
    deleted_at: null,
    messages: [],
    users: [],
  };
};
