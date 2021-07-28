import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

const removeReasons = {
  1: 'Price',
  2: 'Support',
  3: 'Build Times',
  4: 'End of Project',
  5: 'Other'
};

export default class RemoveAccount extends Component {
  @service auth;
  @service api;
  @service flashes;

  @tracked user = this.auth.currentUser;
  @tracked isFeedbackShown = false;
  @tracked password = '';
  @tracked feedbackText = '';
  @tracked reason = '';

  @action
  togglePassword() {
    this.auth.togglePasswordVisibility('password');
  }

  @action
  showFeedback() {
    this.isFeedbackShown = true;
  }

  @action
  onSelectReason(value) {
    this.reason = removeReasons[value];
  }

  @action
  removeAccount() {
    if (this.reason) {
      this.user.removeUser(this.password, { reason: this.reason, text: this.feedbackText }).then(() => {
        //this.auth.signOut();
      }).catch(error => {
        this.flashes.error(error);
      });  
    } else {
      this.flashes.notice('Please specify a reason.');
    }
  }
}
