import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class RepositoryModel extends Model {
  @service storage;
  @service store;
  @service api;

  @attr('string') name;
  @attr('string') displayName;
  @attr('string') url;
  @attr('string') type;
  @attr('string') permission;
  @attr('string') token;
  @attr('string') svnRealm;
  @attr('string') username;
  @attr('date') lastSyncedAt;
  @attr('number') ownerId;
  @attr('string') listener_token;

  @belongsTo('organization', { inverse: null, async: true }) organization;

  get canModify() {
    return true;
  }

  removeToken() {
    return this.api.delete(`/v1/repositories/${this.id}/token`);
  }

  updateToken(username, token, svnRealm) {
    return this.api.patch(`/v1/repositories/${this.id}/token`, {
      data: {
        token: token,
        username: username,
        svn_realm: svnRealm,
      },
    });
  }

  add(orgName, name, url, type, username, token) {
    return this.api.post(`/v1/repositories`, {
      data: {
        owner_name: this.orgName,
        name: name,
        url: url,
        server_type: type,
        username: username,
        token: token,
      },
    });
  }
}
