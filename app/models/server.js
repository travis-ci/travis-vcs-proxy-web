import Model, { attr, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import dynamicQuery from '../utils/dynamic-query';
import config from 'travis/config/environment';

export default class ServerModel extends Model {
  @service storage;
  @service api;

  @attr('string') name;
  @attr('string') url;
  @attr('string') type;
  @attr('string') username;
  @attr('string') token;
  @attr('string') permission;
  @hasMany('user') users;

  @tracked repositories = dynamicQuery(this, function* ({ page = 1, filter = '', sort = 'name' }) {
    const limit = config.pagination.repositoriesPerPage;
    return yield this.store.paginated('repository', {
      limit,
      page,
      sort_by: sort,
      filter,
      custom: {
        server_id: this.id
      },
    }, { live: false });
  });

  forget() {
    return this.api.post(`/v1/server_providers/${this.id}/forget`);
  }
}