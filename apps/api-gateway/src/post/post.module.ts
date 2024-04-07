import { POST_SERVICE, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { ErrorHandlerModule } from '../error/error-handler.module';
import { CommentModule } from './comment.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    RmqModule.register(POST_SERVICE),
    ErrorHandlerModule,
    CommentModule,
    AuthModule,
  ],
  controllers: [PostController],
})
export class PostModule {}
