import { RmqModule, USER_SERVICE } from '@app/common';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ErrorHandlerModule } from '../error/error-handler.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [RmqModule.register(USER_SERVICE), ErrorHandlerModule, AuthModule],
  controllers: [UserController],
})
export class UserModule {}
