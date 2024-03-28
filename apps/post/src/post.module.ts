import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ConfigModule } from '@nestjs/config';
import { MysqlModule, Post, PostRepository, RmqModule } from '@app/common';
import { PostTypeOrmRepository } from '@app/common/repositories/typeorm/post.repository';
import { DataSource } from 'typeorm';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { UserModule } from 'apps/user/src/user.module';
import { UserService } from 'apps/user/src/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RmqModule,
    MysqlModule,
    TypeOrmModule.forFeature([Post]),
    UserModule,
  ],
  controllers: [PostController],
  providers: [
    {
      provide: PostTypeOrmRepository,
      useFactory: (dataSource: DataSource) => {
        return new PostTypeOrmRepository(dataSource.getRepository(Post));
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: PostService,
      useFactory: (postRepo: PostRepository, userService: UserService) => {
        return new PostService(postRepo, userService);
      },
      inject: [PostTypeOrmRepository, UserService],
    },
  ],
})
export class PostModule {}
