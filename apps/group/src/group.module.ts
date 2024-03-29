import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { ConfigModule } from '@nestjs/config';
import {
  Group,
  GroupRepository,
  GroupTypeOrmRepository,
  MysqlModule,
  RmqModule,
} from '@app/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RmqModule,
    MysqlModule,
    TypeOrmModule.forFeature([Group]),
  ],
  controllers: [GroupController],
  providers: [
    {
      provide: GroupTypeOrmRepository,
      useFactory: (dataSource: DataSource) => {
        return new GroupTypeOrmRepository(dataSource.getRepository(Group));
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: GroupService,
      useFactory: (groupRepo: GroupRepository) => {
        return new GroupService(groupRepo);
      },
      inject: [GroupTypeOrmRepository],
    },
  ],
})
export class GroupModule {}
