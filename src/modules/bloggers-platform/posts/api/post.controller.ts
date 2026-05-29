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
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../../blogs/appllcation/blog.service';
import { PostInputModel } from './input-dto/post.input-dto';
import { PostsService } from '../appllcation/post.service';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { PostsQwRepository } from '../infrastructure/query/post.query.repository';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { PostViewModel } from './view-dto/post.view-dto';
import { UsersExternalQueryRepository } from 'src/modules/user-accounts/infrastructure/external-query/users.external-query-repository';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { BasicAuthGuard } from 'src/modules/user-accounts/guard/basic/basic-auth.guard';
import { Public } from 'src/modules/user-accounts/guard/decorators/public.decorator';
import { JwtOptionalAuthGuard } from 'src/modules/user-accounts/guard/bearer/jwt-optional-auth.guard';

@Controller('posts')
@UseGuards(BasicAuthGuard)
@ApiBasicAuth('basicAuth')
@ApiTags('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private blogsService: BlogsService,
    private usersQueryRepository: UsersExternalQueryRepository,
    private postsQwRepository: PostsQwRepository,
  ) {}

  @Public()
  @UseGuards(JwtOptionalAuthGuard)
  @Get()
  async getAll(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewModel[]>> {
    return this.postsQwRepository.getAll(query);
  }

  @Public()
  @UseGuards(JwtOptionalAuthGuard)
  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostViewModel> {
    return this.postsQwRepository.getByIdOrNotFoundFail(id);
  }

  // @Get(':id/comments')
  // @UseGuards(JwtOptionalAuthGuard)
  // async getComment(@Param('postId') postId: string): Promise<> {}

  @Post()
  async createPost(@Body() body: PostInputModel): Promise<PostViewModel> {
    const postId = await this.postsService.createPost(body);
    return await this.postsQwRepository.getByIdOrNotFoundFail(postId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id') id: string,
    @Body() body: PostInputModel,
  ): Promise<void> {
    await this.postsService.updatePost(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string): Promise<void> {
    await this.postsService.deletePost(id);
  }
}
