import { AUTH_SERVICE, LoginUserDto } from '@app/common';
import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { catchError, lastValueFrom } from 'rxjs';
import { ErrorHandlerService } from '../error/error-handler.service';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private authService: ClientRMQ,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @ApiUnauthorizedResponse({ description: 'Email or password wrong' })
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const { token } = await lastValueFrom(
      this.authService.send({ cmd: 'login' }, loginUserDto).pipe(
        catchError((value) => {
          this.errorHandlerService.handle(value);

          return value;
        }),
      ),
    );

    res.cookie('token', token, { httpOnly: true });
    return res.send({ token });
  }
}
