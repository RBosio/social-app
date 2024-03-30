import { CreateMessageDto, MessageRepository } from '@app/common';
import { Injectable } from '@nestjs/common';
import { GroupService } from 'apps/group/src/group.service';
import { UserService } from 'apps/user/src/user.service';

@Injectable()
export class MessageService {
  constructor(
    private messageRepository: MessageRepository,
    private userService: UserService,
    private groupService: GroupService,
  ) {}

  async createMessage(
    messageId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<void> {
    const user = await this.userService.findUserById(createMessageDto.userId);
    const group = await this.groupService.findGroup(createMessageDto.groupId);

    const message = this.messageRepository.create(createMessageDto);
    message.id = messageId;
    message.user = user;
    message.group = group;

    await this.messageRepository.save(message);
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.messageRepository.delete(messageId);
  }
}
