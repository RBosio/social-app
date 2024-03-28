import { User } from '@app/common/database';
import { BaseRepository } from './base.repository';

export interface UserRepository extends BaseRepository<User> {
  findOneByEmail(email: string): Promise<User>;
}
