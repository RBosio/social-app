import { Controller } from '@nestjs/common';
import { MessageService } from './message.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateMessageDto, RmqService } from '@app/common';

@Controller()
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'create_message' })
  async createMessage(
    @Ctx() context: RmqContext,
    @Payload() data: { messageId: string; createMessageDto: CreateMessageDto },
  ): Promise<string> {
    this.rmqService.acknowledgmentMessage(context);

    await this.messageService.createMessage(
      data.messageId,
      data.createMessageDto,
    );

    return 'message created!';
  }

  @MessagePattern({ cmd: 'delete_message' })
  async deleteMessage(
    @Ctx() context: RmqContext,
    @Payload() messageId: string,
  ): Promise<string> {
    this.rmqService.acknowledgmentMessage(context);

    await this.messageService.deleteMessage(messageId);

    return 'message deleted!';
  }
}
