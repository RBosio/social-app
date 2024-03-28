import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import {
  Comment,
  CommentRepository,
  CommentTypeOrmRepository,
  MysqlModule,
  RmqModule,
} from '@app/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { UserService } from 'apps/user/src/user.service';
import { PostService } from '../post/post.service';
import { UserModule } from 'apps/user/src/user.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [
    RmqModule,
    MysqlModule,
    TypeOrmModule.forFeature([Comment]),
    UserModule,
    PostModule,
  ],
  controllers: [CommentController],
  providers: [
    {
      provide: CommentTypeOrmRepository,
      useFactory: (dataSource: DataSource) => {
        return new CommentTypeOrmRepository(dataSource.getRepository(Comment));
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: CommentService,
      useFactory: (
        commentRepo: CommentRepository,
        userService: UserService,
        postService: PostService,
      ) => {
        return new CommentService(commentRepo, userService, postService);
      },
      inject: [CommentTypeOrmRepository, UserService, PostService],
    },
  ],
})
export class CommentModule {}
