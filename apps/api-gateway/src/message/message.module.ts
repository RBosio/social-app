import { MESSAGE_SERVICE, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ErrorHandlerModule } from '../error/error-handler.module';
import { MessageController } from './message.controller';

@Module({
  imports: [RmqModule.register(MESSAGE_SERVICE), ErrorHandlerModule],
  controllers: [MessageController],
})
export class MessageModule {}
