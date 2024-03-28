export interface BaseRepository<T> {
  create(data: any): T;
  save(entity: T): Promise<void>;
  findAll(options?: any): Promise<T[]>;
  findOneById(id: string): Promise<T>;
  delete(id: string): Promise<void>;
}
