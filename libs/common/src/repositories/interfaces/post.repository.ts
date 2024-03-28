import { Post } from '@app/common/database';
import { BaseRepository } from './base.repository';

export interface PostRepository extends BaseRepository<Post> {}
