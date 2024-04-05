import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { GroupModule } from './group/group.module';
import { MessageModule } from './message/message.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    UserModule,
    PostModule,
    GroupModule,
    MessageModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    ChatGateway,
  ],
})
export class ApiGatewayModule {}
