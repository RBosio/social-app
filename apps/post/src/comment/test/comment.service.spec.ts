import { Test } from '@nestjs/testing';
import { CommentService } from '../comment.service';
import { commentStub } from './stubs/comment.stub';
import {
  CreateCommentDto,
  Comment,
  CommentRepository,
  UpdateCommentDto,
} from '@app/common';
import { UserService } from '../../../../user/src/user.service';
import { RpcException } from '@nestjs/microservices';
import { createCommentStub } from './stubs/create-comment.stub';
import { HttpStatus } from '@nestjs/common';
import { PostService } from '../../post/post.service';

jest.mock('../../../../user/src/user.service');
jest.mock('../../post/post.service');
describe('CommentService', () => {
  let commentService: CommentService;
  let commentRepository: CommentRepository;
  let userService: UserService;
  let postService: PostService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: 'CommentRepository',
          useValue: {
            findAll: jest.fn().mockResolvedValue([commentStub()]),
            findOneById: jest.fn().mockResolvedValue(commentStub()),
            create: jest.fn().mockReturnValue(createCommentStub()),
            save: jest.fn().mockResolvedValue(null),
            delete: jest.fn().mockResolvedValue(null),
          },
        },
        UserService,
        PostService,
      ],
    }).compile();

    commentService = moduleRef.get<CommentService>(CommentService);
    commentRepository = moduleRef.get<CommentRepository>('CommentRepository');
    userService = moduleRef.get<UserService>(UserService);
    postService = moduleRef.get<PostService>(PostService);
  });

  describe('findComment', () => {
    describe('when findComment is called', () => {
      let comment: Comment;

      beforeEach(async () => {
        comment = await commentService.findComment(commentStub().id);
      });

      test('then it should call commentRepository', () => {
        expect(commentRepository.findOneById).toHaveBeenCalledWith(
          commentStub().id,
        );
      });

      test('then it should return comment', () => {
        expect(comment).toEqual(commentStub());
      });
    });

    describe('when findComment is called and comment no exist', () => {
      test('then it should throw a rpc exception', async () => {
        jest.spyOn(commentRepository, 'findOneById').mockResolvedValue(null);
        await expect(
          commentService.findComment(commentStub().id),
        ).rejects.toThrow(RpcException);
      });
    });
  });

  describe('createComment', () => {
    describe('when createComment is called', () => {
      const createCommentDto: CreateCommentDto = {
        comment: commentStub().comment,
        userId: commentStub().user.id,
        postId: commentStub().post.id,
      };
      let response;

      beforeEach(async () => {
        response = await commentService.createComment(
          commentStub().id,
          createCommentDto,
        );
      });

      test('then it should call commentRepository', () => {
        expect(commentRepository.create).toHaveBeenCalledWith(createCommentDto);
        expect(commentRepository.save).toHaveBeenCalledWith(commentStub());
      });

      test('then it should return undefined', () => {
        expect(response).toEqual(undefined);
      });
    });

    describe('when createComment is called and user not found', () => {
      test('then it should throw rpc exception', async () => {
        const createCommentDto: CreateCommentDto = {
          comment: commentStub().comment,
          userId: commentStub().user.id,
          postId: commentStub().post.id,
        };
        jest.spyOn(userService, 'findUserById').mockRejectedValueOnce(
          new RpcException({
            message: 'user not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );

        await expect(
          commentService.createComment(commentStub().id, createCommentDto),
        ).rejects.toThrow(RpcException);
      });
    });

    describe('when createComment is called and post not found', () => {
      test('then it should throw rpc exception', async () => {
        const createCommentDto: CreateCommentDto = {
          comment: commentStub().comment,
          userId: commentStub().user.id,
          postId: commentStub().post.id,
        };
        jest.spyOn(postService, 'findPost').mockRejectedValueOnce(
          new RpcException({
            message: 'post not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );

        await expect(
          commentService.createComment(commentStub().id, createCommentDto),
        ).rejects.toThrow(RpcException);
      });
    });
  });

  describe('updateComment', () => {
    describe('when updateComment is called', () => {
      const updateCommentDto: UpdateCommentDto = {
        comment: commentStub().comment,
      };
      let response;

      beforeEach(async () => {
        response = await commentService.updateComment(
          commentStub().id,
          updateCommentDto,
        );
      });

      test('then it should call commentRepository', () => {
        expect(commentRepository.save).toHaveBeenCalledWith(commentStub());
      });

      test('then it should return undefined', () => {
        expect(response).toEqual(undefined);
      });
    });

    describe('when updateComment is called and comment no exist', () => {
      const updateCommentDto: UpdateCommentDto = {
        comment: commentStub().comment,
      };
      test('then it should throw rpc exception', async () => {
        jest.spyOn(commentService, 'findComment').mockRejectedValueOnce(
          new RpcException({
            message: 'comment not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );
        await expect(
          commentService.updateComment(commentStub().user.id, updateCommentDto),
        ).rejects.toThrow(RpcException);
      });
    });
  });

  describe('deleteComment', () => {
    describe('when deleteComment is called', () => {
      let response;

      beforeEach(async () => {
        response = await commentService.deleteComment(commentStub().id);
      });

      test('then it should call commentRepository', () => {
        expect(commentRepository.delete).toHaveBeenCalledWith(commentStub().id);
      });

      test('then it should return undefined', () => {
        expect(response).toEqual(undefined);
      });
    });

    describe('when deleteComment is called and comment no exist', () => {
      test('then it should throw rpc exception', async () => {
        jest.spyOn(commentService, 'findComment').mockRejectedValueOnce(
          new RpcException({
            message: 'comment not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );
        await expect(
          commentService.deleteComment(commentStub().user.id),
        ).rejects.toThrow(RpcException);
      });
    });
  });
});
