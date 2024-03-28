import { Controller, Get } from '@nestjs/common';
import { PostService } from './post.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreatePostDto, Post, RmqService, UpdatePostDto } from '@app/common';

@Controller()
export class PostController {
  constructor(
    private readonly postService: PostService,
    private rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'find_posts' })
  async findPosts(@Ctx() context: RmqContext): Promise<Post[]> {
    this.rmqService.acknowledgmentMessage(context);

    return this.postService.findPosts();
  }

  @MessagePattern({ cmd: 'find_post' })
  async findPost(
    @Ctx() context: RmqContext,
    @Payload() postId: string,
  ): Promise<Post> {
    this.rmqService.acknowledgmentMessage(context);

    return this.postService.findPost(postId);
  }

  @MessagePattern({ cmd: 'create_post' })
  async createPost(
    @Ctx() context: RmqContext,
    @Payload() data: { postId: string; createPostDto: CreatePostDto },
  ): Promise<string> {
    this.rmqService.acknowledgmentMessage(context);

    await this.postService.createPost(data.postId, data.createPostDto);

    return 'post created';
  }

  @MessagePattern({ cmd: 'update_post' })
  async updatePost(
    @Ctx() context: RmqContext,
    @Payload() data: { postId: string; updatePostDto: UpdatePostDto },
  ): Promise<string> {
    this.rmqService.acknowledgmentMessage(context);

    await this.postService.updatePost(data.postId, data.updatePostDto);

    return 'post updated';
  }

  @MessagePattern({ cmd: 'delete_post' })
  async deletePost(
    @Ctx() context: RmqContext,
    @Payload() postId: string,
  ): Promise<string> {
    this.rmqService.acknowledgmentMessage(context);

    await this.postService.deletePost(postId);

    return 'post deleted';
  }
}
