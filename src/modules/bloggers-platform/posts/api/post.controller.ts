import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../../blogs/appllcation/blog.service';
import { PostInputDto } from './input-dto/post.input-dto';
import { PostsService } from '../appllcation/post.service';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { PostsQwRepository } from '../infrastructure/query/post.query.repository';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { PostViewModel } from './view-dto/post.view-dto';
import { UsersExternalQueryRepository } from 'src/modules/user-accounts/infrastructure/external-query/users.external-query-repository';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private blogsService: BlogsService,
    private usersQueryRepository: UsersExternalQueryRepository,
    private postsQwRepository: PostsQwRepository,
  ) {}

  @Get()
  async getAll(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewModel[]>> {
    return this.postsQwRepository.getAll(query);
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostViewModel> {
    return this.postsQwRepository.getByIdOrNotFoundFail(id);
  }

  // @Get(':id/comments')
  // async getComment(@Param('postId') postId: string): Promise<> {

  // }

  @Post()
  async createPost(@Body() body: PostInputDto): Promise<PostViewModel> {
    const postId = await this.postsService.createPost(body);
    return await this.postsQwRepository.getByIdOrNotFoundFail(postId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id') id: string,
    @Body() body: PostInputDto,
  ): Promise<void> {
    await this.postsService.updatePost(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string): Promise<void> {
    await this.postsService.deletePost(id);
  }
}
