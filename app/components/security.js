import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ProfileMenu extends Component {
  @service auth;
  @service router;
  @service api;

  @tracked user = this.auth.currentUser;
  @tracked is2FAEnabled = this.user.otpRequiredForLogin;
  @tracked qrCodeUrl = '';
  @tracked otpAttempt = '';
  @tracked showRecoveryCodes = false;

  @action
  enable2FA() {
    this.auth.enable2FA(this.otpAttempt).then(() => {
      this.showRecoveryModal();
    });
  }

  @tracked codes;
  @tracked joinedCodes;

  @action
  showRecoveryModal() {
    this.user.twoFactorCodes().then((data) => {
      this.codes = data.codes;
      this.joinedCodes = this.codes.join('\n');
      this.showRecoveryCodes = true;
    });
  }

  @action
  closeRecoveryModal() {
    this.showRecoveryCodes = false;
  }

  constructor() {
    super(...arguments);

    this.user
      .twoFactorUrl()
      .then((data) => {
        this.qrCodeUrl = data.url;
      })
      .catch((error) => {
        this.flashes.error(error);
      });
  }
}
