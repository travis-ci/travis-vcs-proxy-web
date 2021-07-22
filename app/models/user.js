import Model, { attr, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class UserModel extends Model {
  @service storage;

  @attr('string') login;
  @attr('string') name;
  @attr emails;
  @attr('boolean') otpRequiredForLogin;

  @hasMany('server') servers;

  get serverCount() {
    return this.servers.length;
  }

  reload(options = {}) {
    return this.store.queryRecord('user', {});
  }
}