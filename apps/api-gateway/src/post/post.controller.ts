import { CreatePostDto, POST_SERVICE, UpdatePostDto } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from '../error/error-handler.service';

@Controller('post')
export class PostController {
  constructor(
    @Inject(POST_SERVICE) private postService: ClientRMQ,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  @Get()
  findPosts() {
    return this.postService.send('find_posts', {});
  }

  @Get(':postId')
  findPost(@Param('postId') postId: string) {
    return this.postService.send('find_post', postId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }

  @Put(':postId')
  createPost(
    @Param('postId') postId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.send('create_post', { postId, createPostDto }).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }

  @Patch(':postId')
  updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.send('update_post', { postId, updatePostDto }).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }

  @Delete(':postId')
  deletePost(@Param('postId') postId: string) {
    return this.postService.send('delete_post', postId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }
}
