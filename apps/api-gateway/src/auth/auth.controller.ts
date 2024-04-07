import { AUTH_SERVICE, LoginUserDto } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { catchError, lastValueFrom } from 'rxjs';
import { ErrorHandlerService } from '../error/error-handler.service';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

interface RequestWithUser extends Request {
  user: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private authService: ClientRMQ,
    private errorHandlerService: ErrorHandlerService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({ description: 'User logged in' })
  @ApiUnauthorizedResponse({ description: 'Email or password wrong' })
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const user = await lastValueFrom(
      this.authService.send({ cmd: 'login' }, loginUserDto).pipe(
        catchError((value) => {
          this.errorHandlerService.handle(value);

          return value;
        }),
      ),
    );
    const token = await this.jwtService.signAsync({ sub: user.id });

    res.cookie('token', `Bearer ${token}`, { httpOnly: true });
    return res.send({ token });
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Profile user' })
  @ApiOkResponse({ description: 'User profile' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async profile(@Req() req: RequestWithUser) {
    return this.authService.send({ cmd: 'profile' }, req.user).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }
}
