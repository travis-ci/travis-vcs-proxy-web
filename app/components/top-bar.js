import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class TopBar extends Component {
  @service auth;
  @service store;
  
  isWhite = false;
  landingPage = false;
  isNavigationOpen = false;
  
  get user() {
    return this.auth.currentUser;
  }

  get isUnconfirmed() {
    if (!this.user)
      return false;
    return !this.user.confirmedAt;
  }

  get userName() {
    let login = this.user.login;
    let name = this.user.name;
    return name || login;
  }

  @action
  toggleNavigation() {
    this.isNavigationOpen = !this.isNavigationOpen;
  }
}
