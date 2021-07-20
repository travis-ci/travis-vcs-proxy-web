import config from 'travis/config/environment';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ServersAdd extends Component {
  constructor() {
    super(...arguments);

    if (this.args.editMode && this.args.server) {
      this.serverName = this.args.server.name;
      this.connectionUrl = this.args.server.url;
      this.serverType = this.args.server.type;
    }
  }

  config = config;

  @tracked serverName = '';
  @tracked connectionUrl = '';
  @tracked serverType = 'perforce';
  @tracked perforceUserName = '';
  @tracked perforceToken = '';

  @action
  addServer() {
  }

  @action
  editServer() {
  }
}
