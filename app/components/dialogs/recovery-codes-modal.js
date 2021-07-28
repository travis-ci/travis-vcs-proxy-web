import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class RecoveryCodesModal extends Component {
  @service api;
  @service auth;

  @tracked user = this.auth.currentUser;

  @tracked isOpen = false;

  constructor() {
    super(...arguments);

    this.user.twoFactorCodes().then((data) => {
      this.codes = data.codes;
      this.joinedCodes = this.codes.join("\n");
    });
  }

  @tracked codes;
  @tracked joinedCodes;

  @action
  printPage() {
    window.print();
  }
}
