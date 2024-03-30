import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    name: 'message',
    description: 'Message',
    type: 'string',
    required: true,
    example: 'Hello, how are you?',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    name: 'userId',
    description: 'User id',
    type: 'string',
    required: true,
    example: '2d4d6481-37b1-4db6-b675-9c08a89b81af',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    name: 'groupId',
    description: 'Group id',
    type: 'string',
    required: true,
    example: '3a1b3468-a410-4a89-936a-81504cc137e1',
  })
  @IsNotEmpty()
  @IsString()
  groupId: string;
}
