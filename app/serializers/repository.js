import JSONSerializer from '@ember-data/serializer/json';
import ApplicationSerializer from './application';

export default class RepositorySerializer extends ApplicationSerializer {
  normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
    const newPayload = payload['repositories'].map((repo) => {
      if (repo['owner']['type'] === 'Organization') {
        repo['organization'] = repo['owner_id'];
      }
      return repo;
    });
    newPayload['meta'] = payload['meta'];
    return super.normalizeQueryResponse(store, primaryModelClass, newPayload || [], id, requestType);
  }

  serialize(snapshot, options) {
    let json = super.serialize(...arguments);

    return { repository: json };
  }
}