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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from '../error/error-handler.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('post')
@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
  private readonly s3Client = new S3Client({
    region: this.configService.get('AWS_S3_REGION'),
  });

  constructor(
    @Inject(POST_SERVICE) private postService: ClientRMQ,
    private errorHandlerService: ErrorHandlerService,
    private configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find all posts' })
  @ApiOkResponse({
    description: 'Return all posts',
  })
  findPosts() {
    return this.postService.send({ cmd: 'find_posts' }, {});
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Find post by id' })
  @ApiParam({
    name: 'postId',
    required: true,
    description: 'Post id',
    example: '3a1b3468-a410-4a89-936a-81504cc137e1',
  })
  @ApiOkResponse({
    description: 'Return post by id',
  })
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  findPost(@Param('postId') postId: string) {
    return this.postService.send({ cmd: 'find_post' }, postId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }

  @Put(':postId')
  @ApiOperation({ summary: 'Create post' })
  @ApiParam({
    name: 'postId',
    required: true,
    description: 'Post id',
    example: '3a1b3468-a410-4a89-936a-81504cc137e1',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreatePostDto,
  })
  @ApiCreatedResponse({
    description: 'Post created',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @UseInterceptors(FileInterceptor('file'))
  createPost(
    @Param('postId') postId: string,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const nameSplitted = file.originalname.split('.');
    const filename = uuid() + '.' + nameSplitted[nameSplitted.length - 1];

    this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('AWS_S3_BUCKET'),
        Key: filename,
        Body: file.buffer,
      }),
    );

    createPostDto.filename = filename;

    return this.postService
      .send({ cmd: 'create_post' }, { postId, createPostDto })
      .pipe(
        catchError((value) => {
          this.errorHandlerService.handle(value);

          return value;
        }),
      );
  }

  @Patch('like/:postId/:userId')
  @ApiOperation({ summary: 'Like post' })
  @ApiParam({
    name: 'postId',
    required: true,
    description: 'Post id',
    example: '3a1b3468-a410-4a89-936a-81504cc137e1',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User id',
    example: '2d4d6481-37b1-4db6-b675-9c08a89b81af',
  })
  @ApiOkResponse({
    description: 'Post liked',
  })
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  likePost(@Param('postId') postId: string, @Param('userId') userId: string) {
    return this.postService.send({ cmd: 'like_post' }, { postId, userId }).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }

  @Patch(':postId')
  @ApiOperation({ summary: 'Update post' })
  @ApiParam({
    name: 'postId',
    required: true,
    description: 'Post id',
    example: '3a1b3468-a410-4a89-936a-81504cc137e1',
  })
  @ApiBody({
    type: UpdatePostDto,
  })
  @ApiOkResponse({
    description: 'Post updated',
  })
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService
      .send({ cmd: 'update_post' }, { postId, updatePostDto })
      .pipe(
        catchError((value) => {
          this.errorHandlerService.handle(value);

          return value;
        }),
      );
  }

  @Delete(':postId')
  @ApiOperation({ summary: 'Delete post' })
  @ApiParam({
    name: 'postId',
    required: true,
    description: 'Post id',
    example: '3a1b3468-a410-4a89-936a-81504cc137e1',
  })
  @ApiOkResponse({
    description: 'Post deleted',
  })
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  deletePost(@Param('postId') postId: string) {
    return this.postService.send({ cmd: 'delete_post' }, postId).pipe(
      catchError((value) => {
        this.errorHandlerService.handle(value);

        return value;
      }),
    );
  }
}
