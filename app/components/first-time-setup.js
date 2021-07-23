import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class FirstTimeSetup extends Component {
  @tracked serverUrl = '';
}
