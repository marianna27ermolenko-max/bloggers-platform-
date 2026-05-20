import { BaseQueryParams } from 'src/core/dto/base.query-params.input-dto';
import { BlogSortBy } from './blogs-sort-by';

export class GetBlogsQueryParams extends BaseQueryParams {
  sortBy = BlogSortBy.CreatedAt;
  searchNameTerm: string | null = null;
}
