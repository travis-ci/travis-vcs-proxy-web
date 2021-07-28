import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class RepositoriesRemoveToken extends Component {
  @service api;
  @service flashes;
  @service router;

  @tracked repo = this.args.repo;

  @action
  removeToken() {
    this.repo.removeToken().then(() => {
      this.flashes.notice('Repository Access Token has been successfully deleted.');
      this.router.transitionTo('server.repositories', this.args.repo.serverProvider.id);
    }).catch(() => {
      this.flashes.error('Could not delete Repository Access Token.');
    });
  }
}
