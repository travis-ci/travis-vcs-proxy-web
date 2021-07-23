import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class RepositoriesRemoveToken extends Component {
  @service api;
  @service flashes;
  @service router;

  @action
  removeToken() {
    this.api.delete(`/v1/repositories/${this.args.repo.id}/token`).then(() => {
      this.flashes.notice('Repository Access Token has been successfully deleted.');
      this.router.transitionTo('server.repositories', this.args.repo.serverProvider.id);
    }).catch(error => {
      this.flashes.error(error);
    });
  }
}
