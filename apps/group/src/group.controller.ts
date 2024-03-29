import { Controller, Get } from '@nestjs/common';
import { GroupService } from './group.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateGroupDto, Group, RmqService, UpdateGroupDto } from '@app/common';

@Controller()
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'find_groups' })
  async findGroups(@Ctx() context: RmqContext): Promise<Group[]> {
    this.rmqService.acknowledgmentMessage(context);

    return this.groupService.findGroups();
  }

  @MessagePattern({ cmd: 'find_group' })
  async findGroup(
    @Ctx() context: RmqContext,
    @Payload() groupId: string,
  ): Promise<Group> {
    this.rmqService.acknowledgmentMessage(context);

    return this.groupService.findGroup(groupId);
  }

  @MessagePattern({ cmd: 'create_group' })
  async createGroup(
    @Ctx() context: RmqContext,
    @Payload() data: { groupId: string; createGroupDto: CreateGroupDto },
  ): Promise<string> {
    this.rmqService.acknowledgmentMessage(context);

    await this.groupService.createGroup(data.groupId, data.createGroupDto);

    return 'group created!';
  }

  @MessagePattern({ cmd: 'update_group' })
  async updateGroup(
    @Ctx() context: RmqContext,
    @Payload() data: { groupId: string; updateGroupDto: UpdateGroupDto },
  ): Promise<string> {
    this.rmqService.acknowledgmentMessage(context);

    await this.groupService.updateGroup(data.groupId, data.updateGroupDto);

    return 'group updated!';
  }

  @MessagePattern({ cmd: 'accept_friend' })
  async acceptFriend(
    @Ctx() context: RmqContext,
    @Payload() groupId: string,
  ): Promise<string> {
    this.rmqService.acknowledgmentMessage(context);

    await this.groupService.acceptFriend(groupId);

    return 'friend accepted!';
  }

  @MessagePattern({ cmd: 'delete_group' })
  async deleteGroup(
    @Ctx() context: RmqContext,
    @Payload() groupId: string,
  ): Promise<string> {
    this.rmqService.acknowledgmentMessage(context);

    await this.groupService.deleteGroup(groupId);

    return 'group deleted!';
  }
}
