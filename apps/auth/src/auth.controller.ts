import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { LoginUserDto, RmqService } from '@app/common';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'login' })
  async login(
    @Ctx() context: RmqContext,
    @Payload() loginUserDto: LoginUserDto,
  ) {
    this.rmqService.acknowledgmentMessage(context);

    return this.authService.login(loginUserDto);
  }

  @MessagePattern({ cmd: 'profile' })
  async profile(@Ctx() context: RmqContext, @Payload() userId: string) {
    this.rmqService.acknowledgmentMessage(context);

    return this.authService.profile(userId);
  }
}
