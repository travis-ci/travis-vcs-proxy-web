import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class Modal extends Component {
  @service animation;

  constructor() {
    super(...arguments);

    this.isVisible = this.args.isVisible;
    this.closeButton = this.args.closeButton;
    this.onClose = this.args.onClose;
  }

  @tracked animationDuration = this.animation.durations.quick;
  @tracked transition = this.animation.transitions.fade;

  closeOnClickOverlay = true;
  closeButton = false;
  @tracked isVisible = true;
  position = 'fixed';
  lastClickInside = false;

  onClose() {
  }

  onClickOverlay() {
    if (!this.lastClickInside && this.closeOnClickOverlay) {
      this.onClose();
    }
    this.lastClickInside = false;
  }

  onClickModal(event) {
    this.lastClickInside = true;
  }
}
