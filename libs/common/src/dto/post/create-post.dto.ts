import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    name: 'description',
    description: 'The description of the post',
    type: 'string',
    required: true,
    example: 'This is a post description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

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
    name: 'file',
    description: 'file',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  file?: Express.Multer.File;
  filename?: string;
}
