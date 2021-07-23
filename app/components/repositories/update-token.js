import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class RepositoriesUpdateToken extends Component {
  @service api;
  @service flashes;
  @service router;

  @tracked token = '';
  @tracked username = '';

  @action
  updateToken() {
    this.api.patch(`/v1/repositories/${this.args.repo.id}/token`, {
      data: {
        token: this.token,
        username: this.username
      }
    }).then(() => {
      this.flashes.notice('Repository Access Token has been successfully updated.');
      this.router.transitionTo('server.repositories', this.args.repo.serverProvider.id);
    }).catch(error => {
      this.flashes.error(error);
    });
  }
}
