import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

describe('GroupController', () => {
  let groupController: GroupController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [GroupService],
    }).compile();

    groupController = app.get<GroupController>(GroupController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(groupController.getHello()).toBe('Hello World!');
    });
  });
});
