import { FindManyOptions, Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UserRepository } from '../interfaces/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(private readonly userRepository: Repository<User>) {}

  create(createUserDto: CreateUserDto): User {
    return this.userRepository.create(createUserDto);
  }

  async save(entity: User): Promise<void> {
    await this.userRepository.save(entity);
  }

  async findAll(options?: FindManyOptions): Promise<User[]> {
    return this.userRepository.find(options);
  }

  async findOneById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
