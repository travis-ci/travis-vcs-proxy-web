import { assert } from '@ember/debug';
import ApplicationAdapter from 'travis/adapters/application';

export default class UserAdapter extends ApplicationAdapter {
  buildURL(modelName, id, snapshot, requestType, query) {
    const isQueryingCurrentUser = requestType === 'queryRecord';
    const isUpdatingCurrentUser = requestType === 'updateRecord' && !id;
    const isQueryOrgUsers = requestType == 'query' && query.custom.org_id;

    assert(
      'Invalid parameters for /user request',
      isQueryingCurrentUser || isUpdatingCurrentUser || isQueryOrgUsers
    );

    if (isQueryOrgUsers) {
      return `${this.urlPrefix()}/organizations/${query.custom.org_id}/users`;
    } else {
      return `${this.urlPrefix()}/user`;
    }
  }
}
