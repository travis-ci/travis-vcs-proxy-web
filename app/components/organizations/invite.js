import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class OrganizationsAdd extends Component {
  @service router;
  @service flashes;
  @service auth;

  @tracked user = this.auth.currentUser;
  @tracked organization = this.args.organization;

  @tracked email = '';
  @tracked selectedRole = this.roles[1];

  roles = ['Owner', 'Member'];

  @action
  inviteUser() {
    this.organization.inviteUser(this.email, this.selectedRole).then(() => {
      this.flashes.success('Successfully invited user.');
      this.router.transitionTo('repositories.index');
    }).catch(() => {
      this.flashes.error('Could not invite user.');
    });
  }
}
