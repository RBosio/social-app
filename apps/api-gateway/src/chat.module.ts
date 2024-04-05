import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MESSAGE_SERVICE, RmqModule } from '@app/common';

@Module({
  imports: [RmqModule.register(MESSAGE_SERVICE)],
  providers: [ChatGateway],
})
export class ChatModule {}
