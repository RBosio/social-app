import { GROUP_SERVICE, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';

@Module({
  imports: [RmqModule.register(GROUP_SERVICE)],
  controllers: [GroupController],
})
export class GroupModule {}
