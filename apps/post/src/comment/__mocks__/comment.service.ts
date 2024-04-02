import { commentStub } from '../test/stubs/comment.stub';

export const CommentService = jest.fn().mockReturnValue({
  findComments: jest.fn().mockResolvedValue([commentStub()]),
  findComment: jest.fn().mockResolvedValue(commentStub()),
  createComment: jest.fn().mockResolvedValue(null),
  likeComment: jest.fn().mockResolvedValue(null),
  updateComment: jest.fn().mockResolvedValue(null),
  deleteComment: jest.fn().mockResolvedValue(null),
});
