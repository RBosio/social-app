import { Test } from '@nestjs/testing';
import { PostController } from '../post.controller';
import { PostService } from '../post.service';
import { CreatePostDto, Post, RmqService, UpdatePostDto } from '@app/common';
import { postStub } from './stubs/post.stub';
import { RmqContext } from '@nestjs/microservices';

jest.mock('../post.service');
describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;
  const mockContext = {} as unknown as RmqContext;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        PostService,
        {
          provide: RmqService,
          useValue: {
            acknowledgmentMessage: jest.fn().mockReturnValue(null),
          },
        },
      ],
    }).compile();

    postController = moduleRef.get<PostController>(PostController);
    postService = moduleRef.get<PostService>(PostService);
  });

  describe('findPosts', () => {
    describe('when findPosts is called', () => {
      let posts: Post[];

      beforeEach(async () => {
        posts = await postController.findPosts(mockContext);
      });

      test('then it should call postService', () => {
        expect(postService.findPosts).toHaveBeenCalled();
      });

      test('then it should return posts', () => {
        expect(posts).toEqual([postStub()]);
      });
    });
  });

  describe('findPost', () => {
    describe('when findPost is called', () => {
      let post: Post;

      beforeEach(async () => {
        post = await postController.findPost(mockContext, postStub().id);
      });

      test('then it should call postService', () => {
        expect(postService.findPost).toHaveBeenCalledWith(postStub().id);
      });

      test('then it should return a post', () => {
        expect(post).toEqual(postStub());
      });
    });
  });

  describe('createPost', () => {
    describe('when createPost is called', () => {
      let response;
      const createPostDto: CreatePostDto = {
        description: postStub().description,
        userId: postStub().user.id,
      };

      beforeEach(async () => {
        response = await postController.createPost(mockContext, {
          postId: postStub().id,
          createPostDto,
        });
      });

      test('then it should call postService', () => {
        expect(postService.createPost).toHaveBeenCalledWith(
          postStub().id,
          createPostDto,
        );
      });

      test('then it should return "post created!"', () => {
        expect(response).toEqual('post created!');
      });
    });
  });

  describe('likePost', () => {
    describe('when likePost is called', () => {
      let response;

      beforeEach(async () => {
        response = await postController.likePost(mockContext, {
          postId: postStub().id,
          userId: postStub().user.id,
        });
      });

      test('then it should call postService', () => {
        expect(postService.likePost).toHaveBeenCalledWith(
          postStub().user.id,
          postStub().id,
        );
      });

      test("then it should return 'post liked!'", () => {
        expect(response).toEqual('post liked!');
      });
    });
  });

  describe('updatePost', () => {
    describe('when updatePost is called', () => {
      let response;
      const updatePostDto: UpdatePostDto = {
        description: postStub().description,
      };
      beforeEach(async () => {
        response = await postController.updatePost(mockContext, {
          postId: postStub().id,
          updatePostDto,
        });
      });

      test('then it should call postService', () => {
        expect(postService.updatePost).toHaveBeenCalledWith(
          postStub().id,
          updatePostDto,
        );
      });

      test('then it should return "post updated!"', () => {
        expect(response).toEqual('post updated!');
      });
    });
  });

  describe('deletePost', () => {
    describe('when deletePost is called', () => {
      let response;

      beforeEach(async () => {
        response = await postController.deletePost(mockContext, postStub().id);
      });

      test('then it should call postService', () => {
        expect(postService.deletePost).toHaveBeenCalledWith(postStub().id);
      });

      test('then it should return "post deleted!"', () => {
        expect(response).toEqual('post deleted!');
      });
    });
  });
});
