import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Post extends BaseEntity {
  @Column()
  description: string;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: number;
}
