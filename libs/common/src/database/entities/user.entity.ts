import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Post } from './post.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @ManyToMany(() => Post, (post) => post.likedBy)
  @JoinTable()
  likedPosts: Post[];
}
