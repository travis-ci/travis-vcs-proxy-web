import ApplicationAdapter from 'travis/adapters/application';

export default class OrganizationAdapter extends ApplicationAdapter {
  pathForType(type) {
    return 'organizations';
  }

  buildURL(modelName, id, snapshot, requestType, query) {
    if (requestType === 'query') {
      return `${this.urlPrefix()}/user/organizations`;
    }

    return super.buildURL(...arguments);
  }
}
