import { Module } from '@nestjs/common';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { BlogsController } from './blogs/api/blogs.controller';
import { PostsController } from './posts/api/post.controller';
import { CommentsController } from './comments/api/comments.controller';
import { BlogsQWRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { BlogsService } from './blogs/appllcation/blog.service';
import { BlogsRepository } from './blogs/infrastructure/blog.repository';
import { PostsService } from './posts/appllcation/post.service';
import { Post, PostSchema } from './posts/domain/post.entity';
import { PostsRepository } from './posts/infrastructure/post.repository';
import { PostsQwRepository } from './posts/infrastructure/query/post.query.repository';
import { Comment, CommentSchema } from './comments/domain/comment.entity';
import { CommentsService } from './comments/appllcation/comment.service';
import { CommentsQwRepository } from './comments/infrastructure/query/comment.qw.repository';

@Module({
  imports: [
    UserAccountsModule,
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [PostsController, BlogsController, CommentsController],
  providers: [
    BlogsQWRepository,
    BlogsService,
    BlogsRepository,
    PostsService,
    PostsRepository,
    PostsQwRepository,
    CommentsService,
    CommentsQwRepository,
  ],
})
export class BloggersPlatformModule {}
