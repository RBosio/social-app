import { CreateGroupDto, GroupRepository, UpdateGroupDto } from '@app/common';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserService } from '../../user/src/user.service';

@Injectable()
export class GroupService {
  constructor(
    @Inject('GroupRepository')
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

    if (createGroupDto.usersId.length < 2) {
      throw new RpcException({
        message: 'group must have at least 2 users',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const userPromises = createGroupDto.usersId.map(async (userId) => {
      const user = await this.userService.findUserById(userId);
      group.users.push(user);
    });

    await Promise.all(userPromises);

    console.log(group);

    await this.groupRepository.save(group);
  }

  async updateGroup(groupId: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.findGroup(groupId);

    const groupUpdated = Object.assign(group, updateGroupDto);

    await this.groupRepository.save(groupUpdated);
  }

  async acceptFriend(groupId: string) {
    const group = await this.findGroup(groupId);
    group.status = 'accepted';

    await this.groupRepository.save(group);
  }

  async deleteGroup(groupId: string) {
    await this.findGroup(groupId);

    await this.groupRepository.delete(groupId);
  }
}
