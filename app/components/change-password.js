import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ChangePassword extends Component {
  @service auth;
  @service api;
  @service flashes;

  @tracked user = this.auth.currentUser;

  @tracked oldPassword = '';
  @tracked newPassword = '';

  @action
  togglePassword(id) {
    this.auth.togglePasswordVisibility(id);
  }

  @action
  changePassword() {
    if (this.auth.checkPasswordComplexity(this.newPassword)) {
      this.user.updatePassword(this.oldPassword, this.newPassword).then(() => {
        this.flashes.success('Your password has been successfully changed');
        this.auth.signOut();
      }).catch(error => {
        this.flashes.error(error);
      });
    }
  }
}
