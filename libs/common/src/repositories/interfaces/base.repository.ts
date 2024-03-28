export interface BaseRepository<T> {
  create(data: object): T;
  save(entity: T): Promise<void>;
  findAll(options?: object): Promise<T[]>;
  findOneById(id: string): Promise<T>;
  findOneByOptions(options: object): Promise<T>;
  delete(id: string): Promise<void>;
}
