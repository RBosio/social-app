import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { GroupModule } from './group/group.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    PostModule,
    GroupModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule {}
