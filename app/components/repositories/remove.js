import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class RepositoriesRemove extends Component {
  @service api;
  @service flashes;
  @service router;
  @service auth;

  @tracked user = this.auth.currentUser;
  @tracked repositories = this.user.repositories;

  @tracked repo = this.args.repo;

  @action
  removeToken() {
    this.repo
      .destroyRecord()
      .then(() => {
        this.flashes.success('Repository has been successfully deleted.');
        this.repositories.reload();
        this.router.transitionTo('repositories.index');
      })
      .catch(() => {
        this.flashes.error('Could not delete Repository.');
      });
  }
}
