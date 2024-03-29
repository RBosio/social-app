import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity("group_")
export class Group extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column()
  status: string;

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];
}
