import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class Repository extends Component {
  @service auth;

  @tracked user = this.auth.currentUser;
}
