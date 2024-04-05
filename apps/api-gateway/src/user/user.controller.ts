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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private userService: ClientRMQ,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiOkResponse({
    description: 'Return all users',
  })
  findUsers() {
    return this.userService.send({ cmd: 'find_users' }, {});
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Find user by id' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User id',
    example: '2d4d6481-37b1-4db6-b675-9c08a89b81af',
  })
  @ApiOkResponse({
    description: 'Return user by id',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  findUser(@Param('userId') userId: string) {
    return this.userService.send({ cmd: 'find_user' }, userId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Create user' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User id',
    example: '2d4d6481-37b1-4db6-b675-9c08a89b81af',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'User created',
  })
  @ApiBadRequestResponse({
    description: 'Email already exists',
  })
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
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User id',
    example: '2d4d6481-37b1-4db6-b675-9c08a89b81af',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'User updated',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
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
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User id',
    example: '2d4d6481-37b1-4db6-b675-9c08a89b81af',
  })
  @ApiOkResponse({
    description: 'User deleted',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  deleteUser(@Param('userId') userId: string) {
    return this.userService.send({ cmd: 'delete_user' }, userId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }
}
