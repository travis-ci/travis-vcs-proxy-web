import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ServersAddRepository extends Component {
  @service api;
  @service flashes;
  @service router;

  @tracked name = '';
  @tracked url = '';

  @tracked server = this.args.server;

  @action
  addRepository() {
    this.server.addRepository(this.name, this.url).then(() => {
      this.flashes.success('Repository has been successfully added.');
      this.server.repositories.switchToPage(1);
      this.router.transitionTo('server.repositories', this.server.id);
    }).catch(() => {
      this.flashes.error('Could not add repository.');
    });
  }
}
