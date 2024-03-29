import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity('group_')
export class Group extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column()
  status: string;

  @OneToMany(() => Message, (message) => message.group)
  messages: Message[];

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];
}
