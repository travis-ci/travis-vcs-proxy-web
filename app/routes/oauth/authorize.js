import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default class OauthAuthorizeRoute extends TravisRoute {
  @service auth;
  @service flashes;
  @service router;

  queryParams = ['client_id'];

  model(params) {
    this.auth.currentUser.getAuthorizedApps().then(data => {
      for (const app of data) {
        if (app.uid === params.client_id) {
          this.auth.currentUser.authorizeOauth(params.client_id, params.response_type, params.state, params.redirect_uri).then((data) => {
            if (data.hasOwnProperty('status') && data.status === 'redirect') {
              window.location.href = data.redirect_uri;
            }
          }).catch(error => {
            this.flashes.error(error);
          });

          break;
        }
      }
    });
  }
}
