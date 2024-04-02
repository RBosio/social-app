import {
  Comment,
  CommentRepository,
  CreateCommentDto,
  UpdateCommentDto,
} from '@app/common';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserService } from '../../../user/src/user.service';
import { PostService } from '../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @Inject('CommentRepository') private commentRepository: CommentRepository,
    private userService: UserService,
    private postService: PostService,
  ) {}

  async findComment(commentId: string): Promise<Comment> {
    const comment = await this.commentRepository.findOneById(commentId);
    if (!comment)
      throw new RpcException({
        message: 'comment not found',
        status: HttpStatus.NOT_FOUND,
      });

    return comment;
  }

  async createComment(
    commentId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<void> {
    const user = await this.userService.findUserById(createCommentDto.userId);
    const post = await this.postService.findPost(createCommentDto.postId);

    const comment = this.commentRepository.create(createCommentDto);
    comment.id = commentId;
    comment.user = user;
    comment.post = post;

    await this.commentRepository.save(comment);
  }

  async updateComment(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<void> {
    const comment = await this.findComment(commentId);

    const commentUpdated = Object.assign(comment, updateCommentDto);

    await this.commentRepository.save(commentUpdated);
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.findComment(commentId);

    await this.commentRepository.delete(commentId);
  }
}
