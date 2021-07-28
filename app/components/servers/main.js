import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ServersMain extends Component {
  @service api;
  @service flashes;
  @service auth;

  @tracked serverUrl = '';
  @tracked searchMode = false;
  @tracked foundServer = null;

  @action
  searchByUrl(event) {
    // Enter key
    if (event.keyCode === 13) {
      this.api.get('/v1/server_providers/by_url', {
        data: {
          url: this.serverUrl
        }
      }).then((data) => {
        this.searchMode = true;
        this.foundServer = data;
      }).catch((error) => {
        this.searchMode = true;
      });
    }
  }

  @action
  clearSearch() {
    this.searchMode = false;
    this.foundServer = null;
    this.serverUrl = '';
  }
}
