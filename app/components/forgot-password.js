import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

const MSG = 'An email with instructions will be sent if the address is correct. Please check your mailbox shortly.';

export default class ForgotPassword extends Component {
  @service api;
  @service flashes;

  @tracked email = '';
  get buttonDisabled() {
    return this.email === '';
  }

  @action
  sendPasswordReset() {
    this.api.post('/v1/user/request_password_reset', {
      data: {
        email: this.email
      }
    }).then(() => {
      this.flashes.notice(MSG);
    }).catch(() => {
      this.flashes.notice(MSG);
    });
  }
}
