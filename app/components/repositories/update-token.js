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

  @tracked repo = this.args.repo;

  @action
  updateToken() {
    this.repo.updateToken(this.username, this.token).then(() => {
      this.flashes.notice('Repository Access Token has been successfully updated.');
      this.router.transitionTo('server.repositories', this.args.repo.serverProvider.id);
    }).catch(() => {
      this.flashes.error('Could not update Repository Access Token.');
    });
  }
}
