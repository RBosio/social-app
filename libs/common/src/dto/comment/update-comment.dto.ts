import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    name: 'comment',
    description: 'The new comment of the post',
    type: 'string',
    required: false,
    example: 'This is a new comment',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
