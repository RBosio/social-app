import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import {
  MAIL_SERVICE,
  MysqlModule,
  RmqModule,
  User,
  UserRepository,
  UserTypeOrmRepository,
} from '@app/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { ClientRMQ } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RmqModule.register(MAIL_SERVICE),
    MysqlModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: UserTypeOrmRepository,
      useFactory: (dataSource: DataSource) => {
        return new UserTypeOrmRepository(dataSource.getRepository(User));
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: UserService,
      useFactory: (userRepo: UserRepository, mailService: ClientRMQ) => {
        return new UserService(userRepo, mailService);
      },
      inject: [UserTypeOrmRepository, MAIL_SERVICE],
    },
  ],
  exports: [UserService],
})
export class UserModule {}
