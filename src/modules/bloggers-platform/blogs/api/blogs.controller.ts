import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { BlogsQWRepository } from '../infrastructure/query/blogs.query-repository';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { BlogViewModel } from './view-dto/blog.view-dto';
import { BlogInputModel } from '../dto/create.blog-dto';
import { BlogsService } from '../appllcation/blog.service';
import { UpdateBlogDto } from '../dto/update.blog-dto';
import { PostsService } from '../../posts/appllcation/post.service';
import { PostViewModel } from '../../posts/api/view-dto/post.view-dto';
import { PostsQwRepository } from '../../posts/infrastructure/query/post.query.repository';
import { GetPostsQueryParams } from '../../posts/api/input-dto/get-posts-query-params.input-dto';
import { PostInputDtoByBlog } from './input-dto/post-ByBlog-input.dto';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { JwtOptionalAuthGuard } from 'src/modules/user-accounts/guard/bearer/jwt-optional-auth.guard';
import { BasicAuthGuard } from 'src/modules/user-accounts/guard/basic/basic-auth.guard';
import { Public } from 'src/modules/user-accounts/guard/decorators/public.decorator';

@Controller('blogs')
@UseGuards(BasicAuthGuard)
@ApiBasicAuth('basicAuth')
@ApiTags('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private postsQwRepository: PostsQwRepository,
    private postsService: PostsService,
    private blogsQWRepository: BlogsQWRepository,
  ) {
    console.log('BlogsController created');
  }

  @Public()
  @Get()
  async getAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewModel[]>> {
    return this.blogsQWRepository.getAll(query);
  }

  @Public()
  @Get(':id')
  async getBlog(@Param('id') id: string): Promise<BlogViewModel> {
    return this.blogsQWRepository.getByIdOrNotFoundFail(id);
  }

  @Public()
  @Get(':blogId/posts')
  @UseGuards(JwtOptionalAuthGuard)
  async getPostsByBlogId(
    //  @ExtractUserIfExistsFromRequest() //ДОПИСАТЬ
    //  user: UserContextDto | null,
    @Param('blogId') blogId: string,
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewModel[]>> {
    await this.blogsQWRepository.getByIdOrNotFoundFail(blogId);
    return this.postsQwRepository.getAllByBlogId(blogId, query); //СЮДА ДОЛЖНЫ БУДЕМ ПЕРЕДАТЬ  И АЙДИ ЮЗЕРА
  }

  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() body: PostInputDtoByBlog,
  ): Promise<PostViewModel> {
    const postId = await this.postsService.createPostByBlogId(blogId, body);
    return this.postsQwRepository.getByIdOrNotFoundFail(postId);
  }

  @Post()
  async createBlog(@Body() body: BlogInputModel) {
    const blogId = await this.blogsService.createBlog(body);
    return this.blogsQWRepository.getByIdOrNotFoundFail(blogId);
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(@Param('id') id: string, @Body() body: UpdateBlogDto) {
    await this.blogsService.updateBlog(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string) {
    await this.blogsService.deleteBlog(id);
  }
}
