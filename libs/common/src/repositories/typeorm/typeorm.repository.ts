import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseRepository } from '../interfaces/base.repository';
import { BaseEntity } from '@app/common/database/entities/base.entity';

export class TypeOrmRepository<T extends BaseEntity>
  implements BaseRepository<T>
{
  constructor(private readonly repository: Repository<T>) {}

  create(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }

  async save(entity: T): Promise<void> {
    await this.repository.save(entity);
  }

  async findAll(
    where?: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<T[]> {
    const options: FindManyOptions = {
      where,
      relations,
    };
    return this.repository.find(options);
  }

  async findOneById(
    id: string,
    relations?: FindOptionsRelations<T>,
  ): Promise<T> {
    const options: FindOneOptions = {
      where: { id },
      relations,
    };
    return this.repository.findOne(options);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
