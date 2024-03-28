import { Comment } from '@app/common/database';
import { CommentRepository } from '../interfaces';
import { TypeOrmRepository } from './typeorm.repository';
import { Repository } from 'typeorm';

export class CommentTypeOrmRepository
  extends TypeOrmRepository<Comment>
  implements CommentRepository
{
  constructor(private readonly commentRepository: Repository<Comment>) {
    super(commentRepository);
  }
}
