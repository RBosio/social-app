import { Test } from '@nestjs/testing';
import { GroupService } from '../group.service';
import { groupStub } from './stubs/group.stub';
import {
  CreateGroupDto,
  Group,
  GroupRepository,
  UpdateGroupDto,
} from '@app/common';
import { UserService } from '../../../user/src/user.service';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

jest.mock('../../../user/src/user.service');
describe('GroupService', () => {
  let groupService: GroupService;
  let groupRepository: GroupRepository;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: 'GroupRepository',
          useValue: {
            findAll: jest.fn().mockResolvedValue([groupStub()]),
            findOneById: jest.fn().mockResolvedValue(groupStub()),
            create: jest.fn().mockReturnValue(groupStub()),
            save: jest.fn().mockResolvedValue(null),
            delete: jest.fn().mockResolvedValue(null),
          },
        },
        UserService,
      ],
    }).compile();

    groupService = moduleRef.get<GroupService>(GroupService);
    groupRepository = moduleRef.get<GroupRepository>('GroupRepository');
    userService = moduleRef.get<UserService>(UserService);
  });

  test('should be defined', () => {
    expect(groupService).toBeDefined();
    expect(groupRepository).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('findGroups', () => {
    describe('when findGroups is called', () => {
      let groups: Group[];

      beforeEach(async () => {
        groups = await groupService.findGroups();
      });

      test('then it should call groupRepository', () => {
        expect(groupRepository.findAll).toHaveBeenCalled();
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
        group = await groupService.findGroup(groupStub().id);
      });

      test('then it should call groupRepository', () => {
        expect(groupRepository.findOneById).toHaveBeenCalledWith(
          groupStub().id,
        );
      });

      test('then it should return group', () => {
        expect(group).toEqual(groupStub());
      });
    });

    describe('when findGroup is called and group no exist', () => {
      test('then it should throw rpc exception', async () => {
        jest.spyOn(groupRepository, 'findOneById').mockResolvedValue(null);
        await expect(groupService.findGroup(groupStub().id)).rejects.toThrow(
          RpcException,
        );
      });
    });
  });

  describe('createGroup', () => {
    describe('when createGroup is called', () => {
      const createGroupDto: CreateGroupDto = {
        status: groupStub().status,
        usersId: [
          '5f8bfaea-3234-4469-bdd9-313fc3cdb702',
          '7d8f6658-2b34-47f5-b525-19bae5c92758',
        ],
      };
      let response;

      beforeEach(async () => {
        response = await groupService.createGroup(
          groupStub().id,
          createGroupDto,
        );
      });

      test('then it should call groupRepository', () => {
        expect(groupRepository.create).toHaveBeenCalledWith(createGroupDto);
      });

      test('then it should return undefined', () => {
        expect(response).toEqual(undefined);
      });
    });

    describe('when createGroup is called and the length of the array of user IDs is less than 2', () => {
      test('then it should throw rpc exception', async () => {
        const createGroupDto: CreateGroupDto = {
          status: groupStub().status,
          usersId: ['5f8bfaea-3234-4469-bdd9-313fc3cdb702'],
        };

        await expect(
          groupService.createGroup(groupStub().id, createGroupDto),
        ).rejects.toThrow(RpcException);
      });
    });

    describe('when createGroup is called and user not found', () => {
      test('then it should throw rpc exception', async () => {
        const createGroupDto: CreateGroupDto = {
          status: groupStub().status,
          usersId: [
            '5f8bfaea-3234-4469-bdd9-313fc3cdb702',
            '7d8f6658-2b34-47f5-b525-19bae5c92758',
          ],
        };
        jest.spyOn(userService, 'findUserById').mockRejectedValueOnce(
          new RpcException({
            message: 'user not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );

        await expect(
          groupService.createGroup(groupStub().id, createGroupDto),
        ).rejects.toThrow(RpcException);
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
        response = await groupService.updateGroup(
          groupStub().id,
          updateGroupDto,
        );
      });

      test('then it should call groupRepository', () => {
        expect(groupRepository.save).toHaveBeenCalledWith(groupStub());
      });

      test('then it should return undefined', () => {
        expect(response).toEqual(undefined);
      });
    });

    describe('when updateGroup is called and group no exist', () => {
      const updateGroupDto: UpdateGroupDto = {
        name: groupStub().name,
      };
      test('then it should throw rpc exception', async () => {
        jest.spyOn(groupService, 'findGroup').mockRejectedValueOnce(
          new RpcException({
            message: 'group not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );
        await expect(
          groupService.updateGroup(groupStub().id, updateGroupDto),
        ).rejects.toThrow(RpcException);
      });
    });
  });

  describe('deleteGroup', () => {
    describe('when deleteGroup is called', () => {
      let response;

      beforeEach(async () => {
        response = await groupService.deleteGroup(groupStub().id);
      });

      test('then it should call groupRepository', () => {
        expect(groupRepository.delete).toHaveBeenCalledWith(groupStub().id);
      });

      test('then it should return undefined', () => {
        expect(response).toEqual(undefined);
      });
    });

    describe('when deleteGroup is called and group no exist', () => {
      test('then it should throw rpc exception', async () => {
        jest.spyOn(groupService, 'findGroup').mockRejectedValueOnce(
          new RpcException({
            message: 'group not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );
        await expect(groupService.deleteGroup(groupStub().id)).rejects.toThrow(
          RpcException,
        );
      });
    });
  });
});
