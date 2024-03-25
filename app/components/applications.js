import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ProfileMenu extends Component {
  @service auth;
  @service api;
  @service flashes;

  @tracked user = this.auth.currentUser;
  @tracked apps = [];

  @action
  revokeApp(id) {
    this.user
      .revokeAuthorizedApp(id)
      .then(() => {
        this.flashes.success('Application revoked.');
        this.apps = this.apps.filter((item) => item.id !== id);
      })
      .catch(() => {
        this.flashes.error('Failed to revoke application.');
      });
  }

  // eslint-disable-next-line
  @tracked apps;

  constructor() {
    super(...arguments);

    this.auth.currentUser.getAuthorizedApps().then((data) => {
      this.apps = data;
    });
  }
}
