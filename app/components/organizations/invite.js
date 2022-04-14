import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default class OrganizationsAdd extends Component {
  @service router;
  @service flashes;
  @service auth;

  @tracked user = this.auth.currentUser;
  @tracked organization = this.args.organization;

  @tracked email = '';
  @tracked selectedRole = this.roles[1];

  isBeta = config.beta == "true";

  roles = [
    { id: 'owner', name: 'Admin' },
    { id: 'member', name: 'Member' },
  ];

  @action
  inviteUser() {
    this.organization.inviteUser(this.email, this.selectedRole.id).then(() => {
      this.flashes.success('Successfully invited user.');
      this.router.transitionTo('repositories.index');
    }).catch(() => {
      if (1) {
        this.auth.betaSignUp(this.email, "11111111111111111", this.organization.id, this.selectedRole.id, this.auth.currentUser.id).then(() => {
        this.organization.inviteUser(this.email, this.selectedRole.id).then(() => {
          this.flashes.success('Successfully invited user.');
          this.router.transitionTo('repositories.index');
          }).catch((error) => {
            this.flashes.error('Could not invite user.');

          });
        });
      }
      else {
        this.flashes.error('Could not invite user.');
      }
    });
  }
}
