import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AUTH_SERVICE, RmqModule } from '@app/common';
import { ErrorHandlerModule } from '../error/error-handler.module';

@Module({
  imports: [RmqModule.register(AUTH_SERVICE), ErrorHandlerModule],
  controllers: [AuthController],
})
export class AuthModule {}
