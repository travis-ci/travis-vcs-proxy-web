import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class RepositoriesList extends Component {
  @tracked repositories = this.args.server.repositories;
}
