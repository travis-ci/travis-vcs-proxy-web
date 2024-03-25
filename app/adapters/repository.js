import ApplicationAdapter from 'travis/adapters/application';

export default class RepositoryAdapter extends ApplicationAdapter {
  buildURL(modelName, id, snapshot, requestType, query) {
    if (requestType === 'query') {
      delete query.custom;

      return `${this.urlPrefix()}/user/repositories`;
    }

    return super.buildURL(...arguments);
  }
}
