import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ProfileMenu extends Component {
  @service auth;
  @service router;
  @service api;

  @tracked user = this.auth.currentUser;
  @tracked apps = [];

  @action
  revokeApp(id) {
    this.user.revokeAuthorizedApp(id).then(() => {
      this.flashes.success('Application revoked.');
    }).catch(error => {
      this.flashes.error('Failed to revoke application.');
    });
  }

  @tracked apps;

  constructor() {
    super(...arguments);

    this.auth.currentUser.getAuthorizedApps().then((data) => {
      this.apps = data;
    });
  }
}
