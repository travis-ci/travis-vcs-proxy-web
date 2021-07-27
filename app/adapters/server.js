import ApplicationAdapter from 'travis/adapters/application';

export default class ServerAdapter extends ApplicationAdapter {
  pathForType(type) {
    return 'server_providers';
  }

  buildURL(modelName, id, snapshot, requestType, query) {
    if (requestType === 'query') {
      return `${this.urlPrefix()}/user/server_providers`
    }

    return super.buildURL(...arguments);
  }
}
