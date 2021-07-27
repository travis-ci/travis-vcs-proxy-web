import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RepositoriesList extends Component {
  @tracked repositories = this.args.server.repositories;
  @tracked repoSearch = '';
  filterTimeout = null;

  @action
  changeSort(sort) {
    this.repositories.applySort(sort);
  }

  @action
  filter() {
    if (this.filterTimeout != null) clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(
      () => {
        this.filterTimeout = null;
        this.repositories.applyFilter(this.repoSearch);
      },
      500
    );
  }
}
