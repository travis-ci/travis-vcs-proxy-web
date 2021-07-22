import config from 'travis/config/environment';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ServersAdd extends Component {
  @service store;
  @service flashes;
  @service router;

  constructor() {
    super(...arguments);

    if (this.args.editMode && this.args.server) {
      this.serverName = this.args.server.name;
      this.connectionUrl = this.args.server.url;
      this.serverType = this.args.server.type;
      this.server = this.args.server;
    }
  }

  config = config;
  server = null;

  @tracked serverName = '';
  @tracked connectionUrl = '';
  @tracked serverType = 'perforce';
  @tracked perforceUserName = '';
  @tracked perforceToken = '';

  @action
  addServer() {
    let server = this.store.createRecord('server');
    server.name = this.serverName;
    server.url = this.connectionUrl;
    server.type = this.serverType;
    try {
      server.save();
      this.flashes.success(`Server "${this.serverName}" is added.`);
      this.router.transitionTo('servers.index');
    } catch (error) {
      this.flashes.error(`Server "${this.serverName}" isn’t added.`);
    }
  }

  @action
  editServer() {
    this.server.name = this.serverName;
    this.server.url = this.connectionUrl;
    this.server.type = this.serverType;
    try {
      this.server.save();
      this.flashes.success(`Server provider "${this.server.name}" has been successfully updated.`);
      this.router.transitionTo('servers.index');
    } catch (error) {
      this.flashes.error(`Could not update Server Provider "${this.server.name}".`);
    }
  }
}
