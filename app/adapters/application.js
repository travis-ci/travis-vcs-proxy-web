import config from 'travis/config/environment';
import RESTAdapter from '@ember-data/adapter/rest';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends RESTAdapter {
  @service storage;
  authStorage = this.storage.auth;

  host = config.apiEndpoint;
  namespace = 'v1';

  get headers() {
    return {
      'Authorization': `Bearer ${this.authStorage.token}`
    };
  }
}