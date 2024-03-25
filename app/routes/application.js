import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

const NO_SIGN_IN_ROUTES = [
  'setup-new-password',
  'forgot-password',
  'unconfirmed',
  'confirmed',
  'resend-confirmation',
];

export default class ApplicationRoute extends Route {
  @service auth;
  @service router;

  beforeModel(transition) {
    if (!NO_SIGN_IN_ROUTES.includes(transition.targetName)) {
      return this.auth.autoSignIn();
    }
  }

  @action
  error(error) {
    if (error === 'needs-auth') {
      const currentURL = new URL(window.location.href);
      const redirectUrl = currentURL.href;
      const queryParams = { redirectUrl };
      return this.router.transitionTo('sign-in', { queryParams: queryParams });
    } else {
      return true;
    }
  }
}
