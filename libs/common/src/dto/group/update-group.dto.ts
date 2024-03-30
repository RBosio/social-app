import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateGroupDto {
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
    name: 'usersId',
    description: 'The users id of the group',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsArray()
  usersId?: number[];
}
