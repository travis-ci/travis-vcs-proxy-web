import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class FirstTimeSetup extends Component {
  @tracked serverUrl = '';
}
