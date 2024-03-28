import { Post, PostRepository } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserService } from 'apps/user/src/user.service';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private userService: UserService,
  ) {}

  async findPosts(): Promise<Post[]> {
    return this.postRepository.findAll({
      user: true,
      likedBy: true,
    });
  }

  async findPost(postId: string): Promise<Post> {
    const post = await this.postRepository.findOneById(postId, {
      user: true,
      likedBy: true,
    });
    if (!post)
      throw new RpcException({
        message: 'post not found',
        status: HttpStatus.NOT_FOUND,
      });

    return post;
  }

  async createPost(postId: string, createPostDto: any): Promise<void> {
    const user = await this.userService.findUserById(createPostDto.userId);

    const post = this.postRepository.create(createPostDto);
    post.id = postId;
    post.user = user;

    await this.postRepository.save(post);
  }

  async likePost(userId: string, postId: string) {
    const post = await this.findPost(postId);
    const user = await this.userService.findUserById(userId);

    post.likedBy.push(user);

    await this.postRepository.save(post);
  }

  async updatePost(postId: string, updatePostDto: any): Promise<void> {
    const post = await this.findPost(postId);

    const postUpdated = Object.assign(post, updatePostDto);

    await this.postRepository.save(postUpdated);
  }

  async deletePost(postId: string): Promise<void> {
    await this.postRepository.delete(postId);
  }
}
