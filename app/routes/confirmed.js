import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default class ConfirmedRoute extends TravisRoute {
  @service flashes;
  @service router;
  @service auth;
  needsAuth = false;

  beforeModel() {
    if (!this.auth.signedIn) {
      this.flashes.success('The confirmation of your account is successful.');
      this.router.transitionTo('sign-in');  
    } else {
      this.router.transitionTo('index');
    }
  }
}
