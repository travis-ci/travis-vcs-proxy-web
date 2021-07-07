import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class TravisStatus extends Component {
  constructor() {
    super(...arguments);

    this.appLoading.fetchTravisStatus.perform();
  }

  @service appLoading;

  get indicator() {
    return this.appLoading.indicator;
  }

  get description() {
    return this.appLoading.description;
  }

  // there is description but it's hidden from outside
  get showTooltip() {
    return !this.args.showDescription && this.description;
  }
}
