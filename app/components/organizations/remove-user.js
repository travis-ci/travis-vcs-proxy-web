import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class OrganizationsRemoveUser extends Component {
  @service router;
  @service flashes;

  @tracked user = this.args.user;
  @tracked organization = this.args.organization;

  @action
  removeUser() {
    this.organization.removeUser(this.user.id).then(() => {
      this.flashes.success(`User "${this.user.name}" successfully removed from "${this.organization.name}"`);
      this.router.transitionTo('repositories.index');
    }).catch((error) => {
      this.flashes.error(`User "${this.user.name}" couldn't be removed from "${this.organization.name}"`);
    });
  }
}