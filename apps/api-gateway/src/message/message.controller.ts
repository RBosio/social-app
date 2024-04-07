import { MESSAGE_SERVICE } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from '../error/error-handler.service';
import { CreateMessageDto } from '@app/common/dto/message';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('message')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Controller('message')
export class MessageController {
  constructor(
    @Inject(MESSAGE_SERVICE) private messageService: ClientRMQ,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  @Put(':messageId')
  @ApiOperation({ summary: 'Create a message' })
  @ApiParam({
    name: 'messageId',
    required: true,
    description: 'Message id',
    example: 'cdd6c62e-423f-4d23-b9e0-57a463912b33',
  })
  @ApiBody({ type: CreateMessageDto })
  @ApiOkResponse({ description: 'Message created' })
  @ApiNotFoundResponse({ description: 'User or group not found' })
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
  @ApiOperation({ summary: 'Delete a message' })
  @ApiParam({
    name: 'messageId',
    required: true,
    description: 'Message id',
    example: 'cdd6c62e-423f-4d23-b9e0-57a463912b33',
  })
  @ApiOkResponse({ description: 'Message deleted' })
  @ApiNotFoundResponse({ description: 'Message not found' })
  async deleteMessage(@Param('messageId') messageId: string) {
    return this.messageService.send({ cmd: 'delete_message' }, messageId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }
}
