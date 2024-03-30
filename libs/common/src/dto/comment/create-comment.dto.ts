import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    name: 'comment',
    description: 'The comment of the post',
    type: 'string',
    required: true,
    example: 'This is a new comment',
  })
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty({
    name: 'userId',
    description: 'The user id',
    type: 'string',
    required: true,
    example: '2d4d6481-37b1-4db6-b675-9c08a89b81af',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    name: 'postId',
    description: 'The post id',
    type: 'string',
    required: true,
    example: '3a1b3468-a410-4a89-936a-81504cc137e1',
  })
  @IsNotEmpty()
  @IsString()
  postId: string;
}
