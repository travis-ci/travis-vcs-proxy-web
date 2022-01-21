import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class RepositoriesList extends Component {
  @service auth;

  @tracked user = this.auth.currentUser;
  @tracked repositories = this.user.repositories;
  @tracked repoSearch = '';
  filterTimeout = null;

  get userHasOrganizations() {
    return this.user.orgPermissions.length > 0;
  }

  @action
  changeSort(sort) {
    this.repositories.applySort(sort);
  }

  @action
  filter() {
    if (this.filterTimeout != null) clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
      this.filterTimeout = null;
      this.repositories.applyFilter(this.repoSearch);
    }, 500);
  }
}
