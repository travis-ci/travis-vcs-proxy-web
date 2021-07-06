import Component from '@glimmer/component';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class ProfileMenu extends Component {
  @service auth;
  @service router;

  isMenuOpen = false;

  get user() {
    this.auth.currentUser;
  }

  get userName() {
    if (this.user.name) {
      return this.user.name;
    } else {
      return this.user.login;
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
      this.set('isMenuOpen', false);
      this.disableAutoClose();
    }
  }

  openMenu() {
    if (!this.isMenuOpen) {
      this.set('isMenuOpen', true);
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
