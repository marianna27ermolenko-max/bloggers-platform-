import { InjectModel } from '@nestjs/mongoose';
import { type CommentModelType, Comment } from '../../domain/comment.entity';
import { CommentViewModel } from '../../api/view-dto/comment.view-dto';
import { NotFoundException } from '@nestjs/common';

export class CommentsQwRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  async getComment(id: string): Promise<CommentViewModel> {
    const comment = await this.CommentModel.findOne({ _id: id });
    if (!comment) {
      throw new NotFoundException('comment not found');
    }
    return CommentViewModel.mapToView(comment);
  }
}
