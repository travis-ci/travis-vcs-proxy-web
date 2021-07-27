import { Promise as EmberPromise } from 'rsvp';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import PaginatedCollection from 'travis/utils/paginated-collection';

export default class PaginatedCollectionPromise extends PaginatedCollection.extend(PromiseProxyMixin) {
  get promise() {
    let content = this.content;
    let promise = new EmberPromise((resolve, reject) => {
      content.then((value) => {
        resolve(PaginatedCollection.create({ content: value }));
      }, (error) => {
        reject(error);
      });
    });
    return promise;
  }
}
