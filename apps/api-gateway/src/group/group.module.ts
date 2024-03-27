import { GROUP_SERVICE, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';

@Module({
  imports: [RmqModule.register(GROUP_SERVICE)],
})
export class GroupModule {}
