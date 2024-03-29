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
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from '../error/error-handler.service';

@Controller('group')
export class GroupController {
  constructor(
    @Inject(GROUP_SERVICE) private groupService: ClientRMQ,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  @Get()
  findGroups() {
    return this.groupService.send({ cmd: 'find_groups' }, {});
  }

  @Get(':groupId')
  findGroup(@Param('groupId') groupId: string) {
    return this.groupService.send({ cmd: 'find_group' }, groupId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }

  @Put(':groupId')
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
  acceptFriend(@Param('groupId') groupId: string) {
    return this.groupService.send({ cmd: 'accept_friend' }, groupId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }

  @Delete(':groupId')
  deleteGroup(@Param('groupId') groupId: string) {
    return this.groupService.send({ cmd: 'delete_group' }, groupId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }
}
