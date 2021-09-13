import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ServersSearchResult extends Component {
  @service auth;
  @service api;
  @service flashes;

  @tracked user = this.auth.currentUser;
  @tracked servers = this.user.servers;

  @tracked clearSearch = null;
  @tracked foundServer = null;

  constructor() {
    super(...arguments);

    this.clearSearch = this.args.clearSearch;
    this.foundServer = this.args.foundServer;
  }

  @action
  addFoundServer() {
    this.api.post('/v1/server_providers/add_by_url', {
      data: {
        url: this.foundServer.url
      }
    }).then((data) => {
      this.flashes.success(`Server "${data.name}" is added.`);
      this.clearSearch();
      this.servers.reload();
    }).catch((error) => {
      this.flashes.error(`Server "${this.foundServer.name}" isn't added.`);
      this.clearSearch();
    });
  }
}
