import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
	@service auth;
  @service router;

  beforeModel() {
    this.auth.autoSignIn();
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
