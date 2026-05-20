import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import {
  ExtendedLikesInfo,
  ExtendedLikesInfoSchema,
} from './extendedLikesInfo.schema';
import { PostInputDto } from '../api/input-dto/post.input-dto';

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true, maxLength: 300 })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

  @Prop({ type: ExtendedLikesInfoSchema })
  extendedLikesInfo: ExtendedLikesInfo;

  createdAt: Date;
  updatedAt: Date;

  static createPost(dto: PostInputDto, blogName: string) {
    const post = new this();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = blogName;
    post.createdAt = new Date();
    post.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
    };

    return post as PostDocument;
  }

  updatePost(this: PostDocument, dto: PostInputDto) {
    this.title = dto.title;
    this.content = dto.content;
    this.shortDescription = dto.shortDescription;
    this.blogId = dto.blogId;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;
export type PostModelType = Model<PostDocument> & typeof Post;
