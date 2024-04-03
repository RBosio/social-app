import { CreateMessageDto, MessageRepository } from '@app/common';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { GroupService } from '../../group/src/group.service';
import { UserService } from '../../user/src/user.service';

@Injectable()
export class MessageService {
  constructor(
    @Inject('MessageRepository') private messageRepository: MessageRepository,
    private userService: UserService,
    private groupService: GroupService,
  ) {}

  async findMessage(messageId: string) {
    const message = await this.messageRepository.findOneById(messageId);
    if (!message)
      throw new RpcException({
        message: 'message not found',
        status: HttpStatus.NOT_FOUND,
      });

    return message;
  }

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
    await this.findMessage(messageId);

    await this.messageRepository.delete(messageId);
  }
}
