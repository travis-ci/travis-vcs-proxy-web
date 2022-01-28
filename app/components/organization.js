import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class Organization extends Component {
  @service auth;
  @service router;

  get routeName() {
    return this.router.currentRoute.localName;
  }

  @tracked user = this.auth.currentUser;
}
