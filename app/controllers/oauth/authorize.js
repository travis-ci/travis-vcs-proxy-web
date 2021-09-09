import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class OauthController extends Controller {
  queryParams = ['client_id', 'response_type', 'redirect_uri', 'state'];
}

