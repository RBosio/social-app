import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import {
  MysqlModule,
  RmqModule,
  User,
  UserRepository,
  UserTypeOrmRepository,
} from '@app/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RmqModule,
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
      useFactory: (userRepo: UserRepository) => {
        return new UserService(userRepo);
      },
      inject: [UserTypeOrmRepository],
    },
  ],
  exports: [UserService],
})
export class UserModule {}
