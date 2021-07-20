import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ServersAdd extends Component {
  @service router;

  @action
  removeServer() {
    this.args.server.destroyRecord();
    this.router.transitionTo('servers.index');
  }
}
