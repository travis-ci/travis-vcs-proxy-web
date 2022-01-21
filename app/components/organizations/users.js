import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class OrganizationsList extends Component {
  @service auth;
  @service store;

  @tracked user = this.auth.currentUser;

  @tracked organization = this.args.organization;
  @tracked users = this.organization.users;

  get isOrganizationAdmin() {
    return this.user.isOrganizationAdmin(this.organization.id);
  }

  @action
  changeSort(sort) {
    this.users.applySort(sort);
  }
}
