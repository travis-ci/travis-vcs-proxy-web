import Model, { attr, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class ServerModel extends Model {
  @service storage;

  @attr('string') name;
  @attr('string') url;
  @attr('string') type;
  @hasMany('repository') repositories;
}