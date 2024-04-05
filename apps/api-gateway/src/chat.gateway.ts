import { MESSAGE_SERVICE } from '@app/common';
import { Inject } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { lastValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { v4 as uuid } from 'uuid';

@WebSocketGateway({
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(@Inject(MESSAGE_SERVICE) private messageClient: ClientRMQ) {}

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId }: { roomId: string },
  ) {
    client.join(roomId);

    return `client ${client.id} joined room ${roomId}`;
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId }: { roomId: string },
  ) {
    client.leave(roomId);

    return `client ${client.id} left room ${roomId}`;
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    {
      roomId,
      message,
      groupId,
      sender,
    }: {
      roomId: string;
      message: string;
      groupId: string;
      sender: {
        userId: string;
        name: string;
      };
    },
  ) {
    const resp = await lastValueFrom(
      this.messageClient.send(
        { cmd: 'create_message' },
        {
          messageId: uuid(),
          createMessageDto: {
            message,
            userId: sender.userId,
            groupId,
          },
        },
      ),
    );
    console.log(resp);

    this.server.to(roomId).emit('message', { message, sender });
  }
}
