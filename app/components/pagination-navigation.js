import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { action } from '@ember/object';

export default class PaginationNavigation extends Component {
  @service router;

  constructor() {
    super(...arguments);
    this.queryParam = this.args.queryParam || this.queryParam;
    this.outer = this.args.outer || this.outer;
    this.inner = this.args.inner || this.inner;
  }

  queryParam = 'page';
  outer = 1;
  inner = 2;

  route = this.router.currentRouteName;

  collection = this.args.collection;
  pagination = this.collection.pagination;

  currentPage = this.pagination.currentPage;
  isFirst = this.pagination.isFirst;
  isLast = this.pagination.isLast;
  offset = this.pagination.offset;
  numberOfPages = this.pagination.numberOfPages;
  perPage = this.pagination.perPage;
  currentRouteName = this.router.currentRouteName;

  get prevPage() {
    return this.isFirst ? null : this.buildPage(this.currentPage - 1);
  }

  get nextPage() {
    return this.isLast ? null : this.buildPage(this.currentPage + 1);
  }

  get pages() {
    const { outer, inner, numberOfPages, currentPage, offset } = this;

    const thresholdDisplayAll = (outer + 1) * 2 + (inner + 1);
    let pageArray = [];

    // display all pages if there is only a few
    if (numberOfPages <= thresholdDisplayAll) {
      for (let i = 0; i < numberOfPages; i++) {
        pageArray.push(this.buildPage(i + 1));
      }
      // else stack together pagination
    } else {
      let innerHalf = Math.ceil(inner / 2);
      let lowerInnerBoundary = currentPage - innerHalf;
      if (lowerInnerBoundary < 0) {
        lowerInnerBoundary = 0;
      }
      let upperInnerBoundary = currentPage + innerHalf;
      let lowerOuterBoundary = 1 + outer;
      let upperOuterBoundary = numberOfPages - outer;

      pageArray.push(this.buildPage(1));

      // outerwindow first page
      if (currentPage !== 1) {
        for (let i = 1; i <= outer; i++) {
          if (i !== currentPage) {
            pageArray.push(this.buildPage(i + 1));
          }
        }
      }

      // ... divider unit
      if (lowerInnerBoundary - pageArray.length > outer) {
        pageArray.push({});
      }

      // innerwindow < current page
      for (let i = lowerInnerBoundary; i < currentPage; i++) {
        if (i > lowerOuterBoundary) {
          pageArray.push(this.buildPage(i));
        }
      }

      if (
        currentPage > lowerOuterBoundary &&
        currentPage < upperOuterBoundary
      ) {
        // current page
        pageArray.push(this.buildPage(currentPage, offset));
      }

      // innerwindow > current page
      for (let i = currentPage + 1; i <= upperInnerBoundary; i++) {
        if (i < upperOuterBoundary) {
          pageArray.push(this.buildPage(i));
        }
      }

      // ... devider unit
      if (upperOuterBoundary - upperInnerBoundary > 1) {
        pageArray.push({});
      }

      // outerwindow last page
      for (let i = upperOuterBoundary; i < numberOfPages; i++) {
        if (!(i < currentPage)) {
          pageArray.push(this.buildPage(i));
        }
      }

      pageArray.push(
        this.buildPage(numberOfPages, this.pagination.last.offset)
      );
    }

    return pageArray;
  }

  get showPagination() {
    return this.pages.length > 1;
  }

  buildPage(num, offset) {
    const { route, queryParam, perPage = 0 } = this;
    const queryParams = { [queryParam]: num };
    const isCurrent = num === this.currentPage;

    if (isEmpty(offset)) {
      offset = perPage * (num - 1);
    }

    const url = this.router.urlFor(route, { queryParams });

    return { num, offset, url, isCurrent, queryParams };
  }

  @action
  switchToPage({ queryParams }) {
    const { router, route } = this;
    router.transitionTo(route, { queryParams });
    return false; // prevent default <a> click handler
  }
}
