import { Message } from '@app/common/database';
import { TypeOrmRepository } from './typeorm.repository';
import { MessageRepository } from '../interfaces/message.repository';
import { Repository } from 'typeorm';

export class MessageTypeOrmRepository
  extends TypeOrmRepository<Message>
  implements MessageRepository
{
  constructor(private readonly messageRepository: Repository<Message>) {
    super(messageRepository);
  }
}
