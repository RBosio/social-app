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
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from '../error/error-handler.service';

@Controller('comment')
export class CommentController {
  constructor(
    @Inject(COMMENT_SERVICE) private commentService: ClientRMQ,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  @Put(':commentId')
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
  deleteComment(@Param('commentId') commentId: string) {
    return this.commentService.send({ cmd: 'delete_comment' }, commentId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }
}
