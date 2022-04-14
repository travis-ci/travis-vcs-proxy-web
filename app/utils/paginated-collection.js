import ArrayProxy from '@ember/array/proxy';
import { tracked } from '@glimmer/tracking';

export default class PaginatedCollection extends ArrayProxy {
  @tracked arrayContent = this.content;

  get pagination() {
    let paginationData = this.content.meta.pagination;
    const { count, offset, limit } = paginationData;

    let object = {
      total: paginationData.count,
      perPage: paginationData.limit,
      offset: paginationData.offset,
      isFirst: paginationData.is_first,
      isLast: paginationData.is_last,
      prev: paginationData.prev,
      next: paginationData.next,
      first: paginationData.first,
      last: paginationData.last,
      currentPage: (offset / limit + 1),
      numberOfPages: Math.ceil(count / limit)
    };

    return object;
  }
}
