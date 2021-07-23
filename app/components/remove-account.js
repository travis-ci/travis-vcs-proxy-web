import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class RemoveAccount extends Component {
  @service auth;
  @service api;
  @service flashes;

  @tracked isFeedbackShown = false;

  @action
  togglePassword() {
    this.auth.togglePasswordVisibility('password');
  }

  @action
  showFeedback() {
    this.isFeedbackShown = true;
  }

  @action
  removeAccount() {
    this.api.patch('/v1/user/update_email', {
      data: {
        email: this.newEmail
      }
    }).then(() => {
      this.flashes.success('Email has been successfully changed.');
    }).catch(error => {
      this.flashes.error(error);
    });
  }
}
