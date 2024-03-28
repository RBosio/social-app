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
import { catchError } from 'rxjs';
import { ErrorHandlerService } from '../error/error-handler.service';

@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private userService: ClientRMQ,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  @Get()
  findUsers() {
    return this.userService.send({ cmd: 'find_users' }, {});
  }

  @Get(':userId')
  findUser(@Param('userId') userId: string) {
    return this.userService.send({ cmd: 'find_user' }, userId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }

  @Put(':userId')
  createUser(
    @Param('userId') userId: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userService
      .send(
        { cmd: 'create_user' },
        {
          userId,
          createUserDto,
        },
      )
      .pipe(
        catchError((value) => {
          this.errorHandlerService.handle(value);

          return value;
        }),
      );
  }

  @Patch(':userId')
  updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService
      .send(
        { cmd: 'update_user' },
        {
          userId,
          updateUserDto,
        },
      )
      .pipe(
        catchError((value) => {
          this.errorHandlerService.handle(value);

          return value;
        }),
      );
  }

  @Delete(':userId')
  deleteUser(@Param('userId') userId: string) {
    return this.userService.send({ cmd: 'delete_user' }, userId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }
}
