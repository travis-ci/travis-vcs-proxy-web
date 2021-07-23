import Model, { attr, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class ServerModel extends Model {
  @service storage;
  @service api;

  @attr('string') name;
  @attr('string') url;
  @attr('string') type;
  @attr('string') username;
  @attr('string') token;
  @hasMany('repository') repositories;
  @hasMany('user') users;

  forget() {
    return this.api.post(`/v1/server_providers/${this.id}/forget`);
  }
}