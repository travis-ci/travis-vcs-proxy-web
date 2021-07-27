import ApplicationAdapter from 'travis/adapters/application';

export default class RepositoryAdapter extends ApplicationAdapter {
  buildURL(modelName, id, snapshot, requestType, query) {
    if (requestType === 'query') {
      const { custom } = query;

      delete query.custom;
  
      if (custom && custom.server_id) {
        return `${this.urlPrefix()}/server_providers/${custom.server_id}/repositories`
      }  
    }

    return super.buildURL(...arguments);
  }
}
