import { MESSAGE_SERVICE, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ErrorHandlerModule } from '../error/error-handler.module';
import { MessageController } from './message.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    RmqModule.register(MESSAGE_SERVICE),
    ErrorHandlerModule,
    AuthModule,
  ],
  controllers: [MessageController],
})
export class MessageModule {}
