import { GROUP_SERVICE, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { ErrorHandlerModule } from '../error/error-handler.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [RmqModule.register(GROUP_SERVICE), ErrorHandlerModule, AuthModule],
  controllers: [GroupController],
})
export class GroupModule {}
