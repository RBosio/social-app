import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserRepository,
} from '@app/common';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@Inject("UserRepository") private userRepository: UserRepository) {}

  async findUsers(): Promise<User[]> {
    const users = await this.userRepository.findAll();

    users.forEach((user) => delete user.password);

    return users;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneById(id, {
      posts: true,
      groups: true,
    });
    if (!user)
      throw new RpcException({
        message: 'user not found',
        status: HttpStatus.NOT_FOUND,
      });

    delete user.password;

    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneByEmail(email);
  }

  async createUser(id: string, createUserDto: CreateUserDto): Promise<void> {
    const userFounded = await this.findUserByEmail(createUserDto.email);
    if (userFounded)
      throw new RpcException({
        message: 'email already exists',
        status: HttpStatus.BAD_REQUEST,
      });

    const user = this.userRepository.create(createUserDto);
    user.id = id;
    user.password = await hash(user.password, 10);

    await this.userRepository.save(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.findUserById(id);

    const userUpdated = Object.assign(user, updateUserDto);

    await this.userRepository.save(userUpdated);
  }

  async deleteUser(id: string): Promise<void> {
    await this.findUserById(id);

    await this.userRepository.delete(id);
  }
}
