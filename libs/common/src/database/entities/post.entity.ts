import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity()
export class Post extends BaseEntity {
  @Column()
  description: string;

  @Column({ nullable: true })
  image?: string;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToMany(() => User, (user) => user.likedPosts)
  likedBy: User[];
}
