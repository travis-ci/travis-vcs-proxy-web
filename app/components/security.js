import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ProfileMenu extends Component {
  @service auth;
  @service router;
  @service api;

  @tracked user = this.auth.currentUser;
  @tracked is2FAEnabled = this.user.otp_required_for_login;
  @tracked qrCodeUrl = '';
  @tracked otpAttempt = '';

  @action
  enable2FA() {
    return this.auth.enable2FA(this.otpAttempt);
  }

  constructor() {
    super(...arguments);

    this.api.get('/v1/user/two_factor_auth/url').then((data) => {
      this.qrCodeUrl = data.url;
    }).catch((error) => {
      this.flashes.error(error);
    });
  }
}
