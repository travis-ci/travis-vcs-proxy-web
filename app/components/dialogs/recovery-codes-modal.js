import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class RecoveryCodesModal extends Component {
  @service api;

  @tracked isOpen = false;

  constructor() {
    super(...arguments);

    this.api.get('/v1/user/two_factor_auth/codes').then((data) => {
      this.codes = data.codes;
    });
  }

  @tracked codes;
}
