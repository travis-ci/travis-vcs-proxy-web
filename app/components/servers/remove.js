import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ServersAdd extends Component {
  @service router;
  @service flashes;
  @service auth;

  @tracked user = this.auth.currentUser;

  @action
  removeServer() {
    const serverName = this.args.server.name;
    this.args.server.forget().then(() => {
      this.user.servers.removeObject(this.args.server);
      this.args.server.unloadRecord();
      this.flashes.success(`Server Provider "${serverName}" has been successfully deleted.`);
      this.router.transitionTo('servers.index');
    }).catch((error) => {
      this.flashes.success(`Server Provider "${serverName}" has not been deleted.`)
    });
  }
}
