import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { ConfigModule } from '@nestjs/config';
import {
  Message,
  MessageRepository,
  MessageTypeOrmRepository,
  RmqModule,
} from '@app/common';
import { UserModule } from 'apps/user/src/user.module';
import { GroupModule } from 'apps/group/src/group.module';
import { DataSource } from 'typeorm';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { UserService } from 'apps/user/src/user.service';
import { GroupService } from 'apps/group/src/group.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RmqModule,
    UserModule,
    GroupModule,
    TypeOrmModule.forFeature([Message]),
  ],
  controllers: [MessageController],
  providers: [
    {
      provide: MessageTypeOrmRepository,
      useFactory: (dataSource: DataSource) => {
        return new MessageTypeOrmRepository(dataSource.getRepository(Message));
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: MessageService,
      useFactory: (
        messageRepo: MessageRepository,
        userService: UserService,
        groupService: GroupService,
      ) => {
        return new MessageService(messageRepo, userService, groupService);
      },
      inject: [MessageTypeOrmRepository, UserService, GroupService],
    },
  ],
})
export class MessageModule {}
