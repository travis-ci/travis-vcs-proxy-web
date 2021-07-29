import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RecoveryCodesModal extends Component {
  @tracked isOpen = false;

  @action
  printPage() {
    window.print();
  }
}
