import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class FlashDisplay extends Component {
  @service flashes;

  get messages() {
    return this.flashes.messages;
  }

  get classes() {
    const classes = this.messages
      .uniqBy('className')
      .mapBy('className')
      .join(' ');
    return `flash ${classes}`;
  }

  @action
  closeMessage(msg) {
    return this.flashes.close(msg);
  }
}
