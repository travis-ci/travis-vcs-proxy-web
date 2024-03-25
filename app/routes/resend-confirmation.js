import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import { CONFIRM_EMAIL_MSG } from 'travis/services/auth';

export default class ResendConfirmationRoute extends TravisRoute {
  @service flashes;
  @service router;
  @service api;
  needsAuth = false;

  model(params) {
    if (params) {
      this.api
        .post('/v1/users/confirmation/resend', {
          data: {
            email: params.email,
          },
        })
        .then(() => {
          this.flashes.notice(
            CONFIRM_EMAIL_MSG.replace(/\{\{email\}\}/g, params.email)
          );
          this.router.transitionTo('sign-in');
        });
    }
  }
}
