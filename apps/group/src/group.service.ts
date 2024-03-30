import { CreateGroupDto, GroupRepository, UpdateGroupDto } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserService } from 'apps/user/src/user.service';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private userService: UserService,
  ) {}

  async findGroups() {
    return this.groupRepository.findAll();
  }

  async findGroup(groupId: string) {
    const group = await this.groupRepository.findOneById(groupId);
    if (!group)
      throw new RpcException({
        message: 'group not found',
        status: HttpStatus.NOT_FOUND,
      });

    return group;
  }

  async createGroup(groupId: string, createGroupDto: CreateGroupDto) {
    const group = this.groupRepository.create(createGroupDto);
    group.id = groupId;
    createGroupDto.usersId.map(async (userId) => {
      const user = await this.userService.findUserById(userId);
      group.users.push(user);
    });

    return this.groupRepository.save(group);
  }

  async updateGroup(groupId: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.findGroup(groupId);

    const groupUpdated = Object.assign(group, updateGroupDto);

    return this.groupRepository.save(groupUpdated);
  }

  async acceptFriend(groupId: string) {
    const group = await this.findGroup(groupId);
    group.status = 'accepted';

    return this.groupRepository.save(group);
  }

  async deleteGroup(groupId: string) {
    return this.groupRepository.delete(groupId);
  }
}
