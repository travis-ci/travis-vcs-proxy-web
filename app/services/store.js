import Store from '@ember-data/store';
import PaginatedCollectionPromise from 'travis/utils/paginated-collection-promise';

export default class TravisVcsStore extends Store {
  defaultAdapter = 'application';
  adapter = 'application';

  // Taken from travis-web
  // Returns a collection with pagination data. If the first page is requested,
  // the collection will be live updated. Otherwise keeping the calculations and
  // figuring out if the record should be put on the page is not easily
  // achieveable (or even impossible in some cases).
  //
  // modelName   - a type of the model as a string, for example 'repo'
  // queryParams - params for a store.query call that will be fired to fetch the
  //               data from the server
  // options     - additional options:
  //               filter      - a filter function that will be used to test if a
  //                             record should be added or removed from the array. It
  //                             will be called with a record under test as an
  //                             argument. It only matters for live updates
  //               sort        - either a string or a function to sort the collection
  //                             with. If it's a string, it should be the name of the
  //                             property to sort by, with an optional ':asc' or
  //                             ':desc' suffixes, for example 'id:desc'. If it's a
  //                             function it will be called with 2 records to compare
  //                             as an argument
  //               dependencies - a set of dependencies that will be watched to
  //                              re-evaluate if a record should be a part of a
  //                              collection
  //               forceReload  - if set to true, store.query will be run on
  //                              call
  //
  // Examples:
  //
  //   store.paginated(
  //     'repo',
  //     { active: true, offset: 0, limit: 10 },
  //     {
  //       filter: (repo) => repo.get('active'),
  //       sort: 'id:desc',
  //       dependencies: ['active'],
  //       forceReload: true
  //     }
  //
  paginated(modelName, queryParams, options = {}) {
    // eslint-disable-next-line
    let allowLive = !options.hasOwnProperty('live') || options.live;
    if (!parseInt(queryParams.offset) && allowLive) {
      // we're on the first page, live updates can be enabled

      // to remove
      // eslint-disable-next-line
      return fetchLivePaginatedCollection(this, ...arguments);
    } else {
      return PaginatedCollectionPromise.create({
        content: this.query(...arguments),
      });
    }
  }
}
