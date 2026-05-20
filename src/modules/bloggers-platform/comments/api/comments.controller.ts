import { Controller, Get, Param } from '@nestjs/common';
// import { CommentsService } from '../appllcation/comment.service';
import { CommentsQwRepository } from '../infrastructure/query/comment.qw.repository';
import { CommentViewModel } from './view-dto/comment.view-dto';

@Controller('comments')
export class CommentsController {
  constructor(
    // private commentsService: CommentsService,
    private commentsQwRepository: CommentsQwRepository,
  ) {}

  @Get(':id')
  async getComment(@Param('id') id: string): Promise<CommentViewModel> {
    return this.commentsQwRepository.getComment(id);
  }
}
