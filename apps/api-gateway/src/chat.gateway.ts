import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
  handleMessage(
    @MessageBody()
    {
      roomId,
      message,
      sender,
    }: {
      roomId: string;
      message: string;
      sender: string;
    },
  ) {
    this.server.to(roomId).emit('message', { message, sender });
  }
}
