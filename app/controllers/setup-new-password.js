import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class SetupNewPasswordController extends Controller {
  queryParams = ['reset_password_token'];
}