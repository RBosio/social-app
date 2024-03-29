import { Message } from '@app/common/database';
import { BaseRepository } from './base.repository';

export interface MessageRepository extends BaseRepository<Message> {}
