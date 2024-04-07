import { COMMENT_SERVICE, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ErrorHandlerModule } from '../error/error-handler.module';
import { CommentController } from './comment.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    RmqModule.register(COMMENT_SERVICE),
    ErrorHandlerModule,
    AuthModule,
  ],
  controllers: [CommentController],
})
export class CommentModule {}
