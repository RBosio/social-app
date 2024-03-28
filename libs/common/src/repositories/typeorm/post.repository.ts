import { Post } from '@app/common/database';
import { PostRepository } from '../interfaces';
import { Repository } from 'typeorm';
import { TypeOrmRepository } from './typeorm.repository';

export class PostTypeOrmRepository
  extends TypeOrmRepository<Post>
  implements PostRepository
{
  constructor(private readonly postRepository: Repository<Post>) {
    super(postRepository);
  }
}
