import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({
    name: 'name',
    description: 'The name of the group',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    name: 'status',
    description: 'The status of the group',
    required: true,
    type: 'string',
    example: 'requested',
  })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({
    name: 'usersId',
    description: 'The users id of the group',
    required: true,
    type: 'array',
    example: ['2d4d6481-37b1-4db6-b675-9c08a89b81af'],
  })
  @IsNotEmpty()
  @IsArray()
  usersId: string[];
}
