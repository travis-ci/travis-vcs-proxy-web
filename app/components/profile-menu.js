import Component from '@glimmer/component';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default class ProfileMenu extends Component {
  @service auth;
  @service router;

  @tracked isMenuOpen = false;

  @tracked user = this.auth.currentUser;

  isBeta = config.beta == 'true';

  get userName() {
    if (this.user) {
      return this.user.name || this.user.login;
    } else {
      return '';
    }
  }

  get redirectUrl() {
    return window.location.href;
  }

  get isSignInPage() {
    return this.router.currentRouteName === 'sign-in';
  }

  get showSignInButton() {
    return !this.isSignInPage;
  }

  closeMenu() {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      this.disableAutoClose();
    }
  }

  openMenu() {
    if (!this.isMenuOpen) {
      this.isMenuOpen = true;
      next(() => this.enableAutoClose());
    }
  }

  enableAutoClose() {
    this.clickHandler = () => {
      this.closeMenu();
    };
    document.addEventListener('click', this.clickHandler);
  }

  disableAutoClose() {
    if (this.clickHandler) {
      document.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
  }

  //willDestroyElement() {
  //  this.closeMenu();
  //}

  @action
  signIn() {
    const { redirectUrl } = this;
    this.router.transitionTo('sign-in', { queryParams: { redirectUrl } });
  }

  @action
  signUp() {
    const { redirectUrl } = this;
    this.router.transitionTo('sign-up', { queryParams: { redirectUrl } });
  }

  @action
  signOut() {
    return this.auth.signOut();
  }

  @action
  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
}
