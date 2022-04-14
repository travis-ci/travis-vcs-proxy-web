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

  @action
  removeOrganization() {
    const organizationName = this.args.organization.name;
    this.organization.destroyRecord().then(() => {
      this.user.organizations.reload();
      this.user.repositories.reload();
      this.flashes.success(`Organization "${organizationName}" has been successfully deleted.`);
      this.router.transitionTo('repositories.index');
    }).catch((error) => {
      this.flashes.error(`Organization "${organizationName}" has not been deleted.`);
    });
  }
}
