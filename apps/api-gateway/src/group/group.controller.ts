import { CreateGroupDto, GROUP_SERVICE, UpdateGroupDto } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from '../error/error-handler.service';
import {
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('group')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Controller('group')
export class GroupController {
  constructor(
    @Inject(GROUP_SERVICE) private groupService: ClientRMQ,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find all groups' })
  @ApiOkResponse({ description: 'Return all groups' })
  findGroups() {
    return this.groupService.send({ cmd: 'find_groups' }, {});
  }

  @Get(':groupId')
  @ApiOperation({ summary: 'Find a group' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User id',
    example: '7ada7c8a-7369-4c90-94a5-03284ed7f78a',
  })
  @ApiOkResponse({ description: 'Return a group' })
  @ApiNotFoundResponse({ description: 'Group not found' })
  findGroup(@Param('groupId') groupId: string) {
    return this.groupService.send({ cmd: 'find_group' }, groupId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }

  @Put(':groupId')
  @ApiOperation({ summary: 'Create a group' })
  @ApiParam({
    name: 'groupId',
    required: true,
    description: 'Group id',
    example: '7ada7c8a-7369-4c90-94a5-03284ed7f78a',
  })
  @ApiBody({ type: CreateGroupDto })
  @ApiCreatedResponse({ description: 'Group created' })
  @ApiNotFoundResponse({ description: 'User not found' })
  createGroup(
    @Param('groupId') groupId: string,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return this.groupService
      .send({ cmd: 'create_group' }, { groupId, createGroupDto })
      .pipe(
        catchError((value) => {
          this.errorHandlerService.handle(value);

          return value;
        }),
      );
  }

  @Patch(':groupId')
  @ApiOperation({ summary: 'Update a group' })
  @ApiParam({
    name: 'groupId',
    required: true,
    description: 'Group id',
    example: '7ada7c8a-7369-4c90-94a5-03284ed7f78a',
  })
  @ApiBody({ type: UpdateGroupDto })
  @ApiOkResponse({ description: 'Group updated' })
  @ApiNotFoundResponse({ description: 'Group or user not found' })
  updateGroup(
    @Param('groupId') groupId: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService
      .send({ cmd: 'update_group' }, { groupId, updateGroupDto })
      .pipe(
        catchError((value) => {
          this.errorHandlerService.handle(value);

          return value;
        }),
      );
  }

  @Patch(':groupId/accept-friend')
  @ApiOperation({ summary: 'Accept a friend' })
  @ApiParam({
    name: 'groupId',
    required: true,
    description: 'Group id',
    example: '7ada7c8a-7369-4c90-94a5-03284ed7f78a',
  })
  @ApiOkResponse({ description: 'Friend accepted' })
  @ApiNotFoundResponse({ description: 'Group not found' })
  acceptFriend(@Param('groupId') groupId: string) {
    return this.groupService.send({ cmd: 'accept_friend' }, groupId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }

  @Delete(':groupId')
  @ApiOperation({ summary: 'Delete a group' })
  @ApiParam({
    name: 'groupId',
    required: true,
    description: 'Group id',
    example: '7ada7c8a-7369-4c90-94a5-03284ed7f78a',
  })
  @ApiOkResponse({ description: 'Group deleted' })
  @ApiNotFoundResponse({ description: 'Group not found' })
  deleteGroup(@Param('groupId') groupId: string) {
    return this.groupService.send({ cmd: 'delete_group' }, groupId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }
}
