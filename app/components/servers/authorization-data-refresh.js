import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ServersAuthorizationDataRefresh extends Component {
  @service flashes;
  @service router;

  @tracked server = this.args.server;
  @tracked username = '';
  @tracked token = '';

  @action
  refreshToken() {
    this.server.refreshToken(this.username, this.token).then(() => {
      this.flashes.success(`Authorization Data Refreshing for "${this.server.name}" is successful.`);
      this.router.transitionTo('servers.index');
    }).catch(() => {
      this.flashes.error(`Authorization Data Refreshing for "${this.server.name}" isn't successful.`);
    });
  }
}
