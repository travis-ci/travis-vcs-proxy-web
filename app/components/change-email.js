import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ChangeEmail extends Component {
  @service auth;
  @service api;
  @service flashes;

  @tracked oldEmail = '';
  @tracked newEmail = '';

  @action
  changeEmail() {
    this.api.patch('/v1/user/update_email', {
      data: {
        email: this.newEmail
      }
    }).then(() => {
      this.flashes.success('Please check your email and confirm your account. If you need to generate a new confirmation email, please resend your confirmation email.');
      this.auth.signOut();
    }).catch(error => {
      this.flashes.error(error);
    });
  }
}
