import { BaseQueryParams } from 'src/core/dto/base.query-params.input-dto';
import { PostSortField } from './post-sort.by';

export class GetPostsQueryParams extends BaseQueryParams {
  sortBy = PostSortField.CreatedAt;
}
