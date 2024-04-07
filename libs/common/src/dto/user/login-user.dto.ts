import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    name: 'email',
    description: 'The email of the user',
    type: 'string',
    required: true,
    example: 'jdoe@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    description: 'The password of the user',
    type: 'string',
    required: true,
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
