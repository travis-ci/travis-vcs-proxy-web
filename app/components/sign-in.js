import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SignIn extends Component {
  @tracked email = '';
  @tracked password = '';
  @service auth;

  @action
  signIn() {
    this.auth.signIn(this.email, this.password);
  }

  @action
  signUp() {
    this.auth.signUp(this.email, this.password);
  }
}
