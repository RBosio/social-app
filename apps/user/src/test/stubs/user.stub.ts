import { User } from '@app/common';

export const userStub = (): User => {
  return {
    id: 'cf8f8b31-5fec-4c5c-91ea-7cd2de4dec5e',
    name: 'fido',
    email: 'fido@gmail.com',
    image: null,
    created_at: new Date('2024-03-30T12:00:00'),
    deleted_at: null,
    comments: [],
    groups: [],
    likedPosts: [],
    posts: [],
    messages: [],
  };
};
