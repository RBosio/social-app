import { Post } from '@app/common';
import { userStub } from '../../../../../user/src/test/stubs/user.stub';

export const postStub = (): Post => {
  return {
    id: '32c0eee9-b7f6-4e8b-964e-868e81fdafec',
    description: 'This is a post',
    filename: null,
    created_at: new Date('2024-03-30T12:00:00'),
    deleted_at: null,
    comments: [],
    likedBy: [],
    user: userStub(),
  };
};
