import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SignIn extends Component {
  @tracked email = '';
  @tracked password = '';
  @tracked otp_attempt = '';
  @service auth;
  @service flashes;

  @action
  togglePassword() {
    let element = document.getElementById('password');
    if (element.getAttribute('type') === 'password') {
      element.setAttribute('autocomplete', 'off');
      element.setAttribute('autocorrect', 'off');
      element.setAttribute('spellcheck', 'off');
      element.setAttribute('autocapitalize', 'off');
      element.setAttribute('type', 'text');
    } else if (element.getAttribute('type') === 'text') {
      element.removeAttribute('autocomplete');
      element.removeAttribute('autocorrect');
      element.removeAttribute('spellcheck');
      element.removeAttribute('autocapitalize');
      element.setAttribute('type', 'password');
    }
  }

  @action
  signIn() {
    this.auth.signIn(this.email, this.password, this.otp_attempt);
  }

  @action
  signUp() {
    if (this.password.length < 6) {
      this.flashes.error('The password must include at least 6 characters.');
    } else if (!this.password.match(/\d+/) && !this.password.match(/[^\w\s]+/)) {
      this.flashes.error('The password must include at least one non-alphabetic character (number or special character).');
    } else if (!this.password.match(/[a-z]+/)) {
      this.flashes.error('The password must include at least one lowercase alphabetic character.');
    } else {
      this.auth.signUp(this.email, this.password);
    }
  }
}
