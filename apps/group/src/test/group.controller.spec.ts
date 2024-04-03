import { Test } from '@nestjs/testing';
import { GroupController } from '../group.controller';
import { GroupService } from '../group.service';
import { CreateGroupDto, Group, RmqService, UpdateGroupDto } from '@app/common';
import { RmqContext } from '@nestjs/microservices';
import { groupStub } from './stubs/group.stub';

jest.mock('../group.service');
describe('GroupController', () => {
  let groupController: GroupController;
  let groupService: GroupService;
  const mockContext = {} as unknown as RmqContext;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [
        GroupService,
        {
          provide: RmqService,
          useValue: {
            acknowledgmentMessage: jest.fn().mockReturnValue(null),
          },
        },
      ],
    }).compile();

    groupController = app.get<GroupController>(GroupController);
    groupService = app.get<GroupService>(GroupService);
  });

  describe('findGroups', () => {
    describe('when findGroups is called', () => {
      let groups: Group[];

      beforeEach(async () => {
        groups = await groupController.findGroups(mockContext);
      });

      test('then it should call groupService', () => {
        expect(groupService.findGroups).toHaveBeenCalled();
      });

      test('then it should return groups', () => {
        expect(groups).toEqual([groupStub()]);
      });
    });
  });

  describe('findGroup', () => {
    describe('when findGroup is called', () => {
      let group: Group;

      beforeEach(async () => {
        group = await groupController.findGroup(mockContext, groupStub().id);
      });

      test('then it should call groupService', () => {
        expect(groupService.findGroup).toHaveBeenCalledWith(groupStub().id);
      });

      test('then it should return a group', () => {
        expect(group).toEqual(groupStub());
      });
    });
  });

  describe('createGroup', () => {
    describe('when createGroup is called', () => {
      const createGroupDto: CreateGroupDto = {
        status: groupStub().status,
        usersId: groupStub().users.map((user) => user.id),
      };
      let response;

      beforeEach(async () => {
        response = await groupController.createGroup(mockContext, {
          groupId: groupStub().id,
          createGroupDto,
        });
      });

      test('then it should call groupService', () => {
        expect(groupService.createGroup).toHaveBeenCalledWith(
          groupStub().id,
          createGroupDto,
        );
      });

      test('then it should return "group created!"', () => {
        expect(response).toEqual('group created!');
      });
    });
  });

  describe('updateGroup', () => {
    describe('when updateGroup is called', () => {
      const updateGroupDto: UpdateGroupDto = {
        name: groupStub().name,
      };
      let response;

      beforeEach(async () => {
        response = await groupController.updateGroup(mockContext, {
          groupId: groupStub().id,
          updateGroupDto,
        });
      });

      test('then it should call groupService', () => {
        expect(groupService.updateGroup).toHaveBeenCalledWith(
          groupStub().id,
          updateGroupDto,
        );
      });

      test('then it should return "group updated!"', () => {
        expect(response).toEqual('group updated!');
      });
    });
  });

  describe('acceptFriend', () => {
    describe('when acceptFriend is called', () => {
      let response;

      beforeEach(async () => {
        response = await groupController.acceptFriend(
          mockContext,
          groupStub().id,
        );
      });

      test('then it should call groupService', () => {
        expect(groupService.acceptFriend).toHaveBeenCalledWith(groupStub().id);
      });

      test('then it should return "friend accepted!"', () => {
        expect(response).toEqual('friend accepted!');
      });
    });
  });

  describe('deleteGroup', () => {
    describe('when deleteGroup is called', () => {
      let response;

      beforeEach(async () => {
        response = await groupController.deleteGroup(
          mockContext,
          groupStub().id,
        );
      });

      test('then it should call groupService', () => {
        expect(groupService.deleteGroup).toHaveBeenCalledWith(groupStub().id);
      });

      test('then it should return "group deleted!"', () => {
        expect(response).toEqual('group deleted!');
      });
    });
  });
});
