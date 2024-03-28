export interface BaseRepository<T> {
  create(data: any): T;
  save(entity: T): Promise<void>;
  findAll(relations?: object): Promise<T[]>;
  findOneById(id: string, relations?: object): Promise<T>;
  delete(id: string): Promise<void>;
}
