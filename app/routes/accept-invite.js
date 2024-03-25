import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default class AcceptInviteRoute extends TravisRoute {
  @service flashes;
  @service router;
  @service auth;
  @service api;
  needsAuth = false;

  queryParams = {
    token: {
      refreshModel: true,
    },
  };

  model(params) {
    if (!this.auth.signedIn) {
      this.flashes.error(
        'Please sign in to the TCI Proxy first and refresh the page with the url to TCI Proxy sign-in page.'
      );
      this.router.transitionTo('sign-in');
    } else {
      const token = params.token;
      this.api
        .post('/v1/organizations/confirm_invitation', {
          data: {
            token,
          },
        })
        .then((org) => {
          let name = org.permission === 'Owner' ? 'admin' : 'member';
          this.flashes.success(
            `Great! You are now a ${name} of ${org.name} organization.`
          );
          this.router.transitionTo('index');
        })
        .catch(() => {
          this.flashes.error(
            'You are trying to use a link, which is already expired. Please use the up to date link.'
          );
          this.router.transitionTo('index');
        });
    }
  }
}
