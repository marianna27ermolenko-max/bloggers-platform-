import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CommentatorInfo,
  CommentatorInfoSchema,
} from './commentatorInfo.schema';
import { LikesInfo, LikesInfoSchema } from './likesInfo.schema';
import { HydratedDocument, Model } from 'mongoose';
import { CommentInputDto } from '../api/input-dto/comment.input-dto';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: CommentatorInfoSchema, required: true })
  commentatorInfo: CommentatorInfo;

  @Prop({ type: LikesInfoSchema, required: true })
  likesInfo: LikesInfo;

  createdAt: Date;
  updatedAt: Date;

  static createComment(
    postId: string,
    userId: string,
    dto: CommentInputDto,
    userLogin: string,
  ) {
    const comment = new this();
    comment.content = dto.content;
    comment.postId = postId;
    comment.createdAt = new Date();

    comment.commentatorInfo = {
      userId,
      userLogin,
    };

    comment.likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
    };

    return comment;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.loadClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;
export type CommentModelType = Model<CommentDocument> & typeof Comment;
