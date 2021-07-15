import { reject } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TravisRoute extends Route {
  @service auth;
  @service router;

  beforeModel(transition) {
    if (!this.auth.signedIn && this.needsAuth) {
      return reject('needs-auth');
    } else if (this.redirectToProfile(transition)) {
      return this.transitionTo('account');
    } else {
      return this._super(...arguments);
    }
  }

  redirectToProfile(transition) {
    let { targetName } = transition;
    let { owner } = this.paramsFor('owner');
    if (targetName === 'owner.repositories' &&
      owner === 'profile') {
      this.transitionTo('account', {
        queryParams: { offset: 0 }
      });
    }
  }
}
