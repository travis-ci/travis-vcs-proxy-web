import Controller from '@ember/controller';

export default class OauthController extends Controller {
  queryParams = ['client_id', 'response_type', 'redirect_uri', 'state'];
}
