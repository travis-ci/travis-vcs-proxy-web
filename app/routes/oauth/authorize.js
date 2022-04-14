import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default class OauthAuthorizeRoute extends TravisRoute {
  @service auth;
  @service flashes;
  @service router;

  queryParams = ['client_id'];
}
