import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ForgotPassword extends Component {
  @service api;
  @service flashes;

  @tracked email = '';

  @action
  sendPasswordReset() {
    this.api.post('/v1/user/request_password_reset', {
      data: {
        email: this.email
      }
    }).then(() => {
      this.flashes.notice('An email with instructions will be sent if the address is correct. Please check your mailbox shortly.');
    }).catch(error => {
      this.flashes.error(error);
    });
  }
}
