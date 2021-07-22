import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class RepositoriesRemoveToken extends Component {
  @service store;
  @service flashes;
  @service router;

  @action
  removeToken() {
  }
}
