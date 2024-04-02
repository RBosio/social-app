import { Test } from '@nestjs/testing';
import { PostService } from '../post.service';
import { postStub } from './stubs/post.stub';
import {
  CreatePostDto,
  Post,
  PostRepository,
  UpdatePostDto,
} from '@app/common';
import { UserService } from '../../../../user/src/user.service';
import { RpcException } from '@nestjs/microservices';
import { createPostStub } from './stubs/create-post.stub';
import { HttpStatus } from '@nestjs/common';

jest.mock('../../../../user/src/user.service');
describe('PostService', () => {
  let postService: PostService;
  let postRepository: PostRepository;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: 'PostRepository',
          useValue: {
            findAll: jest.fn().mockResolvedValue([postStub()]),
            findOneById: jest.fn().mockResolvedValue(postStub()),
            create: jest.fn().mockReturnValue(createPostStub()),
            save: jest.fn().mockResolvedValue(null),
            delete: jest.fn().mockResolvedValue(null),
          },
        },
        UserService,
      ],
    }).compile();

    postService = moduleRef.get<PostService>(PostService);
    postRepository = moduleRef.get<PostRepository>('PostRepository');
    userService = moduleRef.get<UserService>(UserService);
  });

  test('should be defined', () => {
    expect(postService).toBeDefined();
    expect(postRepository).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('findPosts', () => {
    describe('when findPosts is called', () => {
      let posts: Post[];

      beforeEach(async () => {
        posts = await postService.findPosts();
      });

      test('then it should call postRepository', () => {
        expect(postRepository.findAll).toHaveBeenCalled();
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
        post = await postService.findPost(postStub().id);
      });

      test('then it should call postRepository', () => {
        expect(postRepository.findOneById).toHaveBeenCalledWith(postStub().id, {
          user: true,
          likedBy: true,
          comments: {
            user: true,
          },
        });
      });

      test('then it should return post', () => {
        expect(post).toEqual(postStub());
      });
    });

    describe('when findPost is called and post no exist', () => {
      test('then it should throw a rpc exception', async () => {
        jest.spyOn(postRepository, 'findOneById').mockResolvedValue(null);
        await expect(postService.findPost(postStub().id)).rejects.toThrow(
          RpcException,
        );
      });
    });
  });

  describe('createPost', () => {
    describe('when createPost is called', () => {
      const createPostDto: CreatePostDto = {
        description: postStub().description,
        userId: postStub().user.id,
      };
      let response;

      beforeEach(async () => {
        response = await postService.createPost(postStub().id, createPostDto);
      });

      test('then it should call postRepository', () => {
        expect(postRepository.create).toHaveBeenCalledWith(createPostDto);
        expect(postRepository.save).toHaveBeenCalledWith(postStub());
      });

      test('then it should return undefined', () => {
        expect(response).toEqual(undefined);
      });
    });

    describe('when createPost is called and user not found', () => {
      test('then it should throw rpc exception', async () => {
        const createPostDto: CreatePostDto = {
          description: postStub().description,
          userId: postStub().user.id,
        };
        jest.spyOn(userService, 'findUserById').mockRejectedValueOnce(
          new RpcException({
            message: 'user not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );

        await expect(
          postService.createPost(postStub().id, createPostDto),
        ).rejects.toThrow(RpcException);
      });
    });
  });

  describe('likePost', () => {
    describe('when likePost is called', () => {
      let response;

      beforeEach(async () => {
        jest.spyOn(postService, 'findPost').mockResolvedValueOnce(postStub());
        response = await postService.likePost(
          postStub().user.id,
          postStub().id,
        );
      });

      test('then it should call findPost', () => {
        expect(postService.findPost).toHaveBeenCalledWith(postStub().id);
      });

      test('then it should call userService', () => {
        expect(userService.findUserById).toHaveBeenCalledWith(
          postStub().user.id,
        );
      });

      test('then it should return undefined', () => {
        expect(response).toEqual(undefined);
      });
    });

    describe('when likePost is called and post no exist', () => {
      test('then it should throw rpc exception', async () => {
        jest.spyOn(postService, 'findPost').mockRejectedValueOnce(
          new RpcException({
            message: 'post not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );
        await expect(
          postService.likePost(postStub().user.id, postStub().id),
        ).rejects.toThrow(RpcException);
      });
    });

    describe('when likePost is called and user no exist', () => {
      test('then it should throw rpc exception', async () => {
        jest.spyOn(userService, 'findUserById').mockRejectedValueOnce(
          new RpcException({
            message: 'user not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );
        await expect(
          postService.likePost(postStub().user.id, postStub().id),
        ).rejects.toThrow(RpcException);
      });
    });
  });

  describe('updatePost', () => {
    describe('when updatePost is called', () => {
      const updatePostDto: UpdatePostDto = {
        description: postStub().description,
      };
      let response;

      beforeEach(async () => {
        response = await postService.updatePost(postStub().id, updatePostDto);
      });

      test('then it should call postRepository', () => {
        expect(postRepository.save).toHaveBeenCalledWith(postStub());
      });

      test('then it should return undefined', () => {
        expect(response).toEqual(undefined);
      });
    });

    describe('when updatePost is called and post no exist', () => {
      const updatePostDto: UpdatePostDto = {
        description: postStub().description,
      };
      test('then it should throw rpc exception', async () => {
        jest.spyOn(postService, 'findPost').mockRejectedValueOnce(
          new RpcException({
            message: 'post not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );
        await expect(
          postService.updatePost(postStub().id, updatePostDto),
        ).rejects.toThrow(RpcException);
      });
    });
  });

  describe('deletePost', () => {
    describe('when deletePost is called', () => {
      let response;

      beforeEach(async () => {
        response = await postService.deletePost(postStub().id);
      });

      test('then it should call postRepository', () => {
        expect(postRepository.delete).toHaveBeenCalledWith(postStub().id);
      });

      test('then it should return undefined', () => {
        expect(response).toEqual(undefined);
      });
    });

    describe('when deletePost is called and post no exist', () => {
      test('then it should throw rpc exception', async () => {
        jest.spyOn(postService, 'findPost').mockRejectedValueOnce(
          new RpcException({
            message: 'post not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );
        await expect(
          postService.deletePost(postStub().user.id),
        ).rejects.toThrow(RpcException);
      });
    });
  });
});
