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
      refreshModel: true
    }
  }

  model(params) {
    if (!this.auth.signedIn) {
      this.flashes.success('Please sign in or create an account before continuing.');
      this.router.transitionTo('sign-in');
    } else {
      const token = params.token;
      this.api.post('/v1/organizations/confirm_invitation', {
        data: {
          token
        }
      }).then(() => {
        this.flashes.success('Successfully accepted invite.');
        this.router.transitionTo('index');
      }).catch((error) => {
        this.flashes.error('Could not accept invite.');
        this.router.transitionTo('index');
      });;
    }
  }
}
