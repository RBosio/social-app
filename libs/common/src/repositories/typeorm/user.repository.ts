import { FindManyOptions, Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UserRepository } from '../interfaces/user.repository';
import { Injectable } from '@nestjs/common';
import { TypeOrmRepository } from './typeorm.repository';

@Injectable()
export class UserTypeOrmRepository
  extends TypeOrmRepository<User>
  implements UserRepository
{
  constructor(private readonly userRepository: Repository<User>) {
    super(userRepository);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
