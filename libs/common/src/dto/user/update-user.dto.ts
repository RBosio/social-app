import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    name: 'name',
    description: 'The name of the user',
    type: 'string',
    required: false,
    example: 'John',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    name: 'email',
    description: 'The email of the user',
    type: 'string',
    required: false,
    example: 'newpassword',
  })
  @IsOptional()
  @IsString()
  password?: string;
}
