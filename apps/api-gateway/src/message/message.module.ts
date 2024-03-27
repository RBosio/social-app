import { MESSAGE_SERVICE, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';

@Module({
  imports: [RmqModule.register(MESSAGE_SERVICE)],
})
export class MessageModule {}
