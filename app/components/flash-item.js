import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class FlashDisplay extends Component {
  @service flashes;

  get messages() {
    return this.flashes.messages;
  }

  get type() {
    let type = this.args.flash.type;
    return type || 'broadcast';
  }

  get topBarNotVisible() {
    return this.flashes.topBarVisible;
  }

  get isFixed() {
    return this.topBarNotVisible || this.args.flash.aboveOverlay;
  }

  @action
  close() {
    return this.args.close(this.args.flash);
  }
}
