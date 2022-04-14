import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class AccountNav extends Component {
  @service auth;

  @tracked user = this.auth.currentUser;

  get userName() {
    if (this.user) {
      return this.user.name || this.user.login;
    } else {
      return '';
    }
  }
}
