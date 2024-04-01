import { Test } from '@nestjs/testing';
import { CommentController } from '../comment.controller';
import { CommentService } from '../comment.service';
import {
  CreateCommentDto,
  RmqService,
  UpdateCommentDto,
} from '@app/common';
import { commentStub } from './stubs/comment.stub';
import { RmqContext } from '@nestjs/microservices';

jest.mock('../comment.service');
describe('CommentController', () => {
  let commentController: CommentController;
  let commentService: CommentService;
  const mockContext = {} as unknown as RmqContext;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        CommentService,
        {
          provide: RmqService,
          useValue: {
            acknowledgmentMessage: jest.fn().mockReturnValue(null),
          },
        },
      ],
    }).compile();

    commentController = moduleRef.get<CommentController>(CommentController);
    commentService = moduleRef.get<CommentService>(CommentService);
  });

  describe('createComment', () => {
    describe('when createComment is called', () => {
      let response;
      const createCommentDto: CreateCommentDto = {
        comment: commentStub().comment,
        postId: commentStub().post.id,
        userId: commentStub().user.id,
      };

      beforeEach(async () => {
        response = await commentController.createComment(mockContext, {
          commentId: commentStub().id,
          createCommentDto,
        });
      });

      test('then it should call commentService', () => {
        expect(commentService.createComment).toHaveBeenCalledWith(
          commentStub().id,
          createCommentDto,
        );
      });

      test('then it should return "comment created!"', () => {
        expect(response).toEqual('comment created!');
      });
    });
  });

  describe('updateComment', () => {
    describe('when updateComment is called', () => {
      let response;
      const updateCommentDto: UpdateCommentDto = {
        comment: commentStub().comment,
      };
      beforeEach(async () => {
        response = await commentController.updateComment(mockContext, {
          commentId: commentStub().id,
          updateCommentDto,
        });
      });

      test('then it should call commentService', () => {
        expect(commentService.updateComment).toHaveBeenCalledWith(
          commentStub().id,
          updateCommentDto,
        );
      });

      test('then it should return "comment updated!"', () => {
        expect(response).toEqual('comment updated!');
      });
    });
  });

  describe('deleteComment', () => {
    describe('when deleteComment is called', () => {
      let response;

      beforeEach(async () => {
        response = await commentController.deleteComment(
          mockContext,
          commentStub().id,
        );
      });

      test('then it should call commentService', () => {
        expect(commentService.deleteComment).toHaveBeenCalledWith(
          commentStub().id,
        );
      });

      test('then it should return "comment deleted!"', () => {
        expect(response).toEqual('comment deleted!');
      });
    });
  });
});
