import config from 'travis/config/environment';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ServersAdd extends Component {
  @service store;
  @service flashes;
  @service router;
  @service auth;

  constructor() {
    super(...arguments);

    if (this.args.editMode && this.args.server) {
      this.server = this.args.server;
      this.serverName = this.server.name;
      this.connectionUrl = this.server.url;
      this.serverType = this.server.type;
      this.userName = this.server.username;
      this.token = this.server.token;
    }

    if (this.args.url) {
      this.connectionUrl = this.args.url;
    }
  }

  config = config;
  server = null;

  @tracked user = this.auth.currentUser;
  @tracked serverName = '';
  @tracked connectionUrl = '';
  @tracked serverType = 'perforce';
  @tracked userName = '';
  @tracked token = '';
  @tracked svnRealm = '';

  @action
  addServer() {
    let server = this.store.createRecord('server');
    server.name = this.serverName;
    server.url = this.connectionUrl;
    server.type = this.serverType;
    server.username = this.userName;
    server.token = this.token;
    server.save().then(() => {
      this.flashes.success(`Server "${this.serverName}" is added.`);
      this.user.servers.pushObject(server);
      if (this.args.searchNoServer) {
        this.clearSearch();
      } else {
        this.router.transitionTo('servers.index');
      }
    }).catch((error) => {
      this.flashes.error(`Server "${this.serverName}" isn’t added.`);
    });
  }

  @action
  editServer() {
    this.server.name = this.serverName;
    this.server.url = this.connectionUrl;
    this.server.type = this.serverType;
    this.server.username = this.userName;
    this.server.token = this.token;
    this.server.save().then(() => {
      this.flashes.success(`Server provider "${this.server.name}" has been successfully updated.`);
      this.router.transitionTo('servers.index');
    }).catch((error) => {
      this.flashes.error(`Could not update Server Provider "${this.server.name}".`);
    });
  }

  @action
  clearSearch() {
    if (this.args.clearSearch) {
      this.args.clearSearch();
    }
  }
}
