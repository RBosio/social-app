import { RmqModule, USER_SERVICE } from '@app/common';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  imports: [RmqModule.register(USER_SERVICE)],
  controllers: [UserController],
})
export class UserModule {}
