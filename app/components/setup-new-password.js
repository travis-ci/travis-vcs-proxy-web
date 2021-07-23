import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SetupNewPassword extends Component {
  @service api;
  @service auth;
  @service flashes;
  @service router;

  @tracked newPassword = '';

  @action
  togglePassword(id) {
    this.auth.togglePasswordVisibility(id);
  }

  @action
  resetPassword() {
    if (this.auth.checkPasswordComplexity(this.newPassword)) {
      this.api.post('/v1/user/reset_password', {
        data: {
          reset_password_token: this.args.resetPasswordToken,
          password: this.newPassword,
          password_confirmation: this.newPassword
        }
      }).then(() => {
        this.flashes.success('Your password has been successfully changed');
        this.router.transitionTo('index');
      }).catch(error => {
        this.flashes.error('An error occured');
      });
    }
  }
}
