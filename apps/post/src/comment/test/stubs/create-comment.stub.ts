import { Comment } from '@app/common';

export const createCommentStub = (): Comment => {
  return {
    id: 'e3be58fe-ff16-4414-ba97-1be0c4d82246',
    comment: 'This is a comment',
    created_at: new Date('2024-03-30T12:00:00'),
    deleted_at: null,
    user: null,
    post: null,
  };
};
