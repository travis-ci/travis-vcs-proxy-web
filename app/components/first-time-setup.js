import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class FirstTimeSetup extends Component {
  @service api;

  @tracked serverUrl = '';
  @tracked searchMode = false;
  @tracked searchRunning = false;
  @tracked foundServer = null;

  @action
  searchByUrl(event) {
    // Enter key
    if (event.keyCode === 13) {
      this.foundServer = null;
      this.searchRunning = true;
      this.api.get('/v1/server_providers/by_url', {
        data: {
          url: this.serverUrl
        }
      }).then((data) => {
        this.searchMode = true;
        this.searchRunning = false;
        this.foundServer = data;
      }).catch((error) => {
        this.searchMode = true;
        this.searchRunning = false;
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
