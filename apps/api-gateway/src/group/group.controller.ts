import { CreateGroupDto, GROUP_SERVICE, UpdateGroupDto } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

@Controller('group')
export class GroupController {
  constructor(@Inject(GROUP_SERVICE) private groupService: ClientRMQ) {}

  @Get()
  findGroups() {
    return this.groupService.send('find_groups', {});
  }

  @Get(':groupId')
  findGroup() {
    return this.groupService.send('find_group', {});
  }

  @Put(':groupId')
  createGroup(
    @Param('groupId') groupId: string,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return this.groupService.send('create_group', { groupId, createGroupDto });
  }

  @Patch(':groupId')
  updateGroup(
    @Param('groupId') groupId: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.send('update_group', { groupId, updateGroupDto });
  }

  @Patch(':groupId/accept-friend')
  acceptFriend(@Param('groupId') groupId: string) {
    return this.groupService.send('accept_friend', { groupId });
  }

  @Delete(':groupId')
  deleteGroup(@Param('groupId') groupId: string) {
    return this.groupService.send('delete_group', { groupId });
  }
}
