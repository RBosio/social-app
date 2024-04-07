import { LoginUserDto } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserService } from 'apps/user/src/user.service';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.findUserByEmail(loginUserDto.email);
    if (!user)
      throw new RpcException({
        message: 'email or password wrong!',
        status: HttpStatus.UNAUTHORIZED,
      });

    if (!(await compare(loginUserDto.password, user.password)))
      throw new RpcException({
        message: 'email or password wrong!',
        status: HttpStatus.UNAUTHORIZED,
      });

    return user;
  }
  profile(userId: string) {}
}
