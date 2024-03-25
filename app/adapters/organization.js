import ApplicationAdapter from 'travis/adapters/application';

export default class OrganizationAdapter extends ApplicationAdapter {
  pathForType() {
    return 'organizations';
  }

  buildURL(modelName, id, snapshot, requestType) {
    if (requestType === 'query') {
      return `${this.urlPrefix()}/user/organizations`;
    }

    return super.buildURL(...arguments);
  }
}
