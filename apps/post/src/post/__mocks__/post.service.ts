import { postStub } from '../test/stubs/post.stub';

export const PostService = jest.fn().mockReturnValue({
  findPosts: jest.fn().mockResolvedValue([postStub()]),
  findPost: jest.fn().mockResolvedValue(postStub()),
  createPost: jest.fn().mockResolvedValue(null),
  updatePost: jest.fn().mockResolvedValue(null),
  deletePost: jest.fn().mockResolvedValue(null),
});
