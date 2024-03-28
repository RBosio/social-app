import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateUserDto, RmqService, UpdateUserDto, User } from '@app/common';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'find_users' })
  async findUsers(@Ctx() context: RmqContext): Promise<User[]> {
    this.rmqService.acknowledgmentMessage(context);

    return this.userService.findUsers();
  }

  @MessagePattern({ cmd: 'find_user' })
  async findUser(
    @Ctx() context: RmqContext,
    @Payload() userId: string,
  ): Promise<User> {
    this.rmqService.acknowledgmentMessage(context);

    return this.userService.findUserById(userId);
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(
    @Ctx() context: RmqContext,
    @Payload()
    data: {
      userId: string;
      createUserDto: CreateUserDto;
    },
  ): Promise<string> {
    this.rmqService.acknowledgmentMessage(context);

    await this.userService.createUser(data.userId, data.createUserDto);

    return 'user created!';
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(
    @Ctx() context: RmqContext,
    @Payload()
    data: {
      userId: string;
      updateUserDto: UpdateUserDto;
    },
  ): Promise<string> {
    this.rmqService.acknowledgmentMessage(context);

    await this.userService.updateUser(data.userId, data.updateUserDto);

    return 'user updated!';
  }

  @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(
    @Ctx() context: RmqContext,
    @Payload() userId: string,
  ): Promise<string> {
    this.rmqService.acknowledgmentMessage(context);

    await this.userService.deleteUser(userId);

    return 'user deleted!';
  }
}
