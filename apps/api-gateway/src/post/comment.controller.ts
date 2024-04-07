import {
  COMMENT_SERVICE,
  CreateCommentDto,
  UpdateCommentDto,
} from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from '../error/error-handler.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('comment')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Controller('comment')
export class CommentController {
  constructor(
    @Inject(COMMENT_SERVICE) private commentService: ClientRMQ,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  @Put(':commentId')
  @ApiOperation({ summary: 'Create a comment' })
  @ApiParam({
    name: 'commentId',
    description: 'The comment id',
    type: 'string',
    required: true,
    example: 'df69a560-c447-4ac4-ac6d-01789d630109',
  })
  @ApiBody({
    type: CreateCommentDto,
    description: 'The comment of the post',
  })
  @ApiCreatedResponse({
    description: 'Comment created',
  })
  @ApiNotFoundResponse({ description: 'User or post not found' })
  createComment(
    @Param('commentId') commentId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService
      .send({ cmd: 'create_comment' }, { commentId, createCommentDto })
      .pipe(
        catchError((value) => {
          this.errorHandlerService.handle(value);

          return value;
        }),
      );
  }

  @Patch(':commentId')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({
    name: 'commentId',
    description: 'The comment id',
    type: 'string',
    required: true,
    example: 'df69a560-c447-4ac4-ac6d-01789d630109',
  })
  @ApiBody({
    type: UpdateCommentDto,
    description: 'The new comment of the post',
  })
  @ApiOkResponse({ description: 'Comment updated successfully' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService
      .send({ cmd: 'update_comment' }, { commentId, updateCommentDto })
      .pipe(
        catchError((value) => {
          this.errorHandlerService.handle(value);

          return value;
        }),
      );
  }

  @Delete(':commentId')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({
    name: 'commentId',
    description: 'The comment id',
    type: 'string',
    required: true,
    example: 'df69a560-c447-4ac4-ac6d-01789d630109',
  })
  @ApiOkResponse({ description: 'Comment deleted successfully' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  deleteComment(@Param('commentId') commentId: string) {
    return this.commentService.send({ cmd: 'delete_comment' }, commentId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }
}
