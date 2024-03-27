import { POST_SERVICE, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';

@Module({
  imports: [RmqModule.register(POST_SERVICE)],
})
export class PostModule {}
