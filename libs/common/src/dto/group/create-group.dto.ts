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
  })
  @IsNotEmpty()
  @IsArray()
  usersId: string[];
}
