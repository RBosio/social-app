import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    name: 'description',
    description: 'The new description of the post',
    type: 'string',
    required: false,
    example: 'This is a new post description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
