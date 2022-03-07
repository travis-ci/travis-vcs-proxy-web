import config from 'travis/config/environment';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SignIn extends Component {
  config = config;

  @tracked email = '';
  @tracked password = '';
  @tracked otp_attempt = '';
  @service auth;
  @service flashes;

  isBeta = config.beta == "true";

  @action
  togglePassword() {
    this.auth.togglePasswordVisibility('password');
  }

  @action
  signIn() {
    this.auth.signIn(this.email, this.password, this.otp_attempt);
  }

  @action
  signUp() {
    if (this.auth.checkPasswordComplexity(this.password)) {
      this.auth.signUp(this.email, this.password);
    }
  }
}
