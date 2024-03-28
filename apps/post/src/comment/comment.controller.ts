import { Controller } from '@nestjs/common';
import { CommentService } from './comment.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateCommentDto, RmqService, UpdateCommentDto } from '@app/common';

@Controller()
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'create_comment' })
  async createComment(
    @Ctx() context: RmqContext,
    @Payload() data: { commentId: string; createCommentDto: CreateCommentDto },
  ): Promise<string> {
    this.rmqService.acknowledgmentMessage(context);

    await this.commentService.createComment(
      data.commentId,
      data.createCommentDto,
    );

    return 'comment created';
  }

  @MessagePattern({ cmd: 'update_comment' })
  async updateComment(
    @Ctx() context: RmqContext,
    @Payload() data: { commentId: string; updateCommentDto: UpdateCommentDto },
  ): Promise<string> {
    this.rmqService.acknowledgmentMessage(context);

    await this.commentService.updateComment(
      data.commentId,
      data.updateCommentDto,
    );

    return 'comment updated';
  }

  @MessagePattern({ cmd: 'delete_comment' })
  async deleteComment(
    @Ctx() context: RmqContext,
    @Payload() commentId: string,
  ): Promise<string> {
    this.rmqService.acknowledgmentMessage(context);

    await this.commentService.deleteComment(commentId);

    return 'comment deleted';
  }
}
