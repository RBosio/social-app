import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Group } from './group.entity';

@Entity()
export class Message extends BaseEntity {
  @Column()
  message: string;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  @ManyToOne(() => Group, (group) => group.messages)
  group: Group;
}
