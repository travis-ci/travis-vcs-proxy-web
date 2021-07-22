import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class RepositoryModel extends Model {
  @service storage;

  @attr('string') name;
  @attr('string') url;
  @attr('string') type;
  @belongsTo('server') serverProvider;
}