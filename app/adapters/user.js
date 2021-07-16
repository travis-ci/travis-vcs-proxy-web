
import { assert } from '@ember/debug';
import ApplicationAdapter from 'travis/adapters/application';

export default class UserAdapter extends ApplicationAdapter {
  buildURL(modelName, id, snapshot, requestType, query) {
    const isQueryingCurrentUser = requestType === 'queryRecord';
    const isUpdatingCurrentUser = requestType === 'updateRecord' && !id;

    assert('Invalid parameters for /user request', isQueryingCurrentUser || isUpdatingCurrentUser);

    return `${this.urlPrefix()}/user`;
  }
}

