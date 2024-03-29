import { Group } from '@app/common/database';
import { TypeOrmRepository } from './typeorm.repository';
import { Repository } from 'typeorm';
import { GroupRepository } from '../interfaces';

export class GroupTypeOrmRepository
  extends TypeOrmRepository<Group>
  implements GroupRepository
{
  constructor(private groupRepository: Repository<Group>) {
    super(groupRepository);
  }
}
