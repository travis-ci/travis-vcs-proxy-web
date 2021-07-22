import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ServersAdd extends Component {
  @service router;
  @service flashes;

  @action
  removeServer() {
    const serverName = this.args.server.name;
    this.args.server.destroyRecord().then(() => {
      this.flashes.success(`Server Provider "${serverName}" has been successfully deleted.`);
      this.router.transitionTo('servers.index');  
    }).catch(() => {
      this.flashes.success(`Server Provider "${serverName}" has not been deleted.`)
    });
  }
}
