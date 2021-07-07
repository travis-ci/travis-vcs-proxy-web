import { run } from '@ember/runloop';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

const messageTypeToIcon = {
  notice: 'icon-flag',
  success: 'flash-success',
  error: 'flash-error'
};

const messageTypeToCloseButton = {
  notice: true,
  success: false,
  error: true
};

export default class Flashes extends Service {
  @service auth;
  @service store;

  @tracked currentUser = this.auth.currentUser;
  @tracked flashes;

  constructor() {
    super(...arguments);

    this.setup();
  }

  setup() {
    this.flashes = [];
  };

  get messages() {
    let flashes = this.flashes;
    let model = [];
    if (flashes.length) {
      model.pushObjects(flashes.toArray());
    }
    return model.uniq();
  }

  loadFlashes(flashes = []) {
    flashes.forEach(flash => {
      const type = Object.keys(flash)[0];
      const { message, aboveOverlay } = flash[type];
      const icon = messageTypeToIcon[type];
      const closeButton = messageTypeToCloseButton[type];
      const item = { type, message, icon, closeButton, aboveOverlay };

      this.flashes.unshiftObject(item);

      if (!closeButton) this.removeFlash(item);
    });
  }

  removeFlash(msg) {
    setTimeout(() => {
      run(this, () => {
        if (this.flashes.length > 0) {
          return this.flashes.removeObject(msg);
        }
      });
      // Fadeout is currently done separatly with css, and completes at 7s. Keeping the message around longer than that can result in weird situations
      // where reloading a page can result in a message showing again that you thought was gone.
    }, 7000);
  }

  close(msg) {
    return this.flashes.removeObject(msg);
  }

  clear() {
    this.setup();
  }

  display(type, message, aboveOverlay = false) {
    if (!['error', 'notice', 'success'].includes(type)) {
      // eslint-disable-next-line
      console.warn("WARNING: <service:flashes> display(type, message) function can only handle 'error', 'notice' and 'success' types");
    }

    this.loadFlashes([{ [type]: { message, aboveOverlay } }]);
  }

  success(message, aboveOverlay = false) {
    this.display('success', message, aboveOverlay);
  }

  error(message, aboveOverlay = false) {
    this.display('error', message, aboveOverlay);
  }

  notice(message, aboveOverlay = false) {
    this.display('notice', message, aboveOverlay);
  }
}
