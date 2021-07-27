import Model, { attr, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import dynamicQuery from '../utils/dynamic-query';
import config from 'travis/config/environment';

export default class UserModel extends Model {
  @service storage;
  @service store;

  @attr('string') login;
  @attr('string') name;
  @attr emails;
  @attr('boolean') otpRequiredForLogin;

  @tracked servers = dynamicQuery(this, function* ({ page = 1 }) {
    const limit = config.pagination.serversPerPage;
    return yield this.store.paginated('server', {
      limit,
      page,
      sort_by: 'name',
    }, { live: false });
  });

  reload(options = {}) {
    return this.store.queryRecord('user', {});
  }
}