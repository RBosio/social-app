import { Comment } from '@app/common/database';
import { BaseRepository } from './base.repository';

export interface CommentRepository extends BaseRepository<Comment> {}
