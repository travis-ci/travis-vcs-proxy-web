import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class RepositoryModel extends Model {
  @service storage;
  @service store;

  @attr('string') name;
  @attr('string') url;
  @attr('string') type;
  @attr('string') permission;
  @attr('string') token;
  @attr('date') lastSyncedAt;
  @attr('number') serverProviderId;

  get canModify() {
    return this.permission === 'admin' || this.permission === 'super';
  }

  get serverProvider() {
    return this.store.peekRecord('server', this.serverProviderId)
      || this.store.findRecord('server', this.serverProviderId);
  };

  removeToken() {
    return this.api.delete(`/v1/repositories/${this.id}/token`);
  }

  updateToken(username, token) {
    return this.api.patch(`/v1/repositories/${this.args.repo.id}/token`, {
      data: {
        token: token,
        username: username
      }
    });
  }
}