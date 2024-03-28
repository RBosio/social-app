import { CreateUserDto, USER_SERVICE, UpdateUserDto } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(@Inject(USER_SERVICE) private userService: ClientRMQ) {}

  @Get()
  findUsers() {
    return this.userService.send('find_users', {});
  }

  @Get(':userId')
  findUser(@Param('userId') userId: string) {
    return this.userService.send('find_user', userId);
  }

  @Put(':userId')
  createUser(
    @Param('userId') userId: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userService.send('create_user', {
      userId,
      createUserDto,
    });
  }

  @Patch(':userId')
  updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.send('update_user', {
      userId,
      updateUserDto,
    });
  }

  @Delete(':userId')
  deleteUser(@Param('userId') userId: string) {
    return this.userService.send('delete_user', userId);
  }
}
