import { reject } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TravisRoute extends Route {
  @service auth;
  @service router;
  @service flashes;
  @service store;

  beforeModel(transition) {
    if (!this.auth.signedIn && this.needsAuth) {
      return reject('needs-auth');
    } else if (
      this.auth.signedIn &&
      this.auth.currentUser &&
      !this.auth.currentUser.otpRequiredForLogin &&
      transition.targetName !== 'account.index' &&
      transition.targetName !== 'account.security'
    ) {
      this.flashes.error(
        'You have to enable two-factor authentication before beginning work with the service.'
      );
      return this.transitionTo('account');
    } else {
      return super.beforeModel(...arguments);
    }
  }

  redirectToProfile(transition) {
    let { targetName } = transition;
    let { owner } = this.paramsFor('owner');
    if (targetName === 'owner.repositories' && owner === 'profile') {
      this.transitionTo('account', {
        queryParams: { offset: 0 },
      });
    }
  }
}
