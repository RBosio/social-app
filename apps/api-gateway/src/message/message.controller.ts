import { MESSAGE_SERVICE } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Put,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from '../error/error-handler.service';
import { CreateMessageDto } from '@app/common/dto/message';

@Controller('message')
export class MessageController {
  constructor(
    @Inject(MESSAGE_SERVICE) private messageService: ClientRMQ,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  @Put(':messageId')
  async createMessage(
    @Param('messageId') messageId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messageService
      .send({ cmd: 'create_message' }, { messageId, createMessageDto })
      .pipe(
        catchError((value) => {
          this.errorHandlerService.handle(value);

          return value;
        }),
      );
  }

  @Delete(':messageId')
  async deleteMessage(@Param('messageId') messageId: string) {
    return this.messageService.send({ cmd: 'delete_message' }, messageId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }
}
