import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { keepLatestTask } from 'ember-concurrency';
import { get } from '@ember/object';

const STATE = {
  SIGNING_IN: 'signing_in',
  SIGNED_IN: 'signed_in',
  SIGNED_OUT: 'signed_out',
  REQUIRES_2FA: 'requires_2fa'
};

const TOKEN_EXPIRED_MSG = "You've been signed out, because your access token has expired.";
const UNAUTHORIZED_MSG = "Invalid email or password.";
const MUST_CONFIRM_EMAIL_API_MSG = "You have to confirm your email address before continuing.";
const MUST_CONFIRM_EMAIL_MSG = `Your account is not confirmed. Please check your email and confirm your account.<br>If you need to generate a new confirmation email, please <a href="resend_confirmation?email={{email}}">resend your confirmation email</a>.`;
export const CONFIRM_EMAIL_MSG = `Please check your email and confirm your account. If you need to generate a new confirmation email, please <a href="resend_confirmation?email={{email}}">resend your confirmation email</a>.`;

export default class AuthService extends Service {
  @tracked state = STATE.SIGNED_OUT;
  @service store;
  @service('storage') localStorage;
  @service api;
  @service flashes;
  @service router;
  storage = this.localStorage.auth;
  @tracked currentUser = null;

  get signedIn() {
    return this.state == STATE.SIGNED_IN;
  }
  get signingIn() {
    return this.state == STATE.SIGNING_IN;
  }
  get signedOut() {
    return this.state == STATE.SIGNED_OUT;
  }
  get requires2FA() {
    return this.state == STATE.REQUIRES_2FA;
  }

  get token() {
    this.storage.get('token');
  }

  signIn(email, password, otp_attempt) {
    this.api.post(
      '/v1/users/login',
      {
        data: {
          user: {
            email,
            password,
            otp_attempt
          }
        }
      }
    ).then((data) => {
      if (data.otp_enabled && data.token === '') {
        this.set('state', STATE.REQUIRES_2FA);
      } else {
        // Set token
        this.storage.set('token', data.token);
        this.handleLogin().then(() => {
          if (this.currentUser) {
            this.set('state', STATE.SIGNED_IN);
            this.router.transitionTo('/');
          }
        });
      }
    }).catch((error) => {
      if (error === MUST_CONFIRM_EMAIL_API_MSG) {
        this.flashes.error(MUST_CONFIRM_EMAIL_MSG.replace(/\{\{email\}\}/g, email));
      } else {
        if (!error) {
          this.flashes.error(UNAUTHORIZED_MSG);
        } else {
          this.flashes.error(error);
        }
      }
    });
  }

  signUp(email, password) {
    this.api.post(
      '/v1/users',
      {
        data: {
          user: {
            email,
            password,
          }
        }
      }
    ).then(() => {
      this.flashes.notice(CONFIRM_EMAIL_MSG.replace(/\{\{email\}\}/g, email));
      this.router.transitionTo('unconfirmed');
    }).catch((error) => {
      this.flashes.error(error);
    });
  }

  betaSignUp(email, password, organization, role, current_user) {
    this.api.post(
      '/v1/users',
      {
        data: {
          user: {
            email,
            password,
          },
          organization: {
            id: organization,
            role
          },
          current_user: {
            id: current_user
          }
        }
      }
    ).then(() => {});
  }

  autoSignIn() {
    console.log('Automatically signing in');
    this.set('state', STATE.SIGNING_IN);
    try {
      return this.handleLogin().then(() => {
        if (this.currentUser) {
          this.set('state', STATE.SIGNED_IN);
        } else {
          this.flashes.error(TOKEN_EXPIRED_MSG);
          this.signOut();
        }
      });
    } catch (error) {
      this.signOut();
    }
  }

  enable2FA(otpAttempt) {
    return this.api.post(
      '/v1/user/two_factor_auth/enable',
      {
        data: {
            otp_attempt: otpAttempt
        }
      }
    ).then((data) => {
      if (data.otp_enabled) {
        // Set token
        this.storage.set('token', data.token);
        return this.handleLogin().then(() => {
          if (this.currentUser) {
            this.set('state', STATE.SIGNED_IN);
          }
        });
      }
    }).catch((error) => {
      this.flashes.error(error);
    });
  }

  handleLogin() {
    const { storage } = this;
    const { token } = storage;

    if (!token) throw new Error('No login data');

    this.flashes.clear();
    return this.reloadUser().then((userRecord) => {
      if (userRecord) {
        this.currentUser = userRecord;
        storage.accounts.addObject(userRecord);
        storage.set('user', userRecord);
      }
    });
  }

  reloadUser() {
    return this.fetchUser.perform();
  }

  @keepLatestTask *fetchUser() {
    try {
      return yield this.store.queryRecord('user', {});
    } catch (error) {
      const status = +error.status || +get(error, 'errors.firstObject.status');
      if (status === 401 || status === 403 || status === 500) {
        this.flashes.error(TOKEN_EXPIRED_MSG);
        this.signOut();
      }
    }
  }

  signOut() {
    if (this.signedIn) {
      this.api.delete('/v1/users/logout');
    }

    this.storage.clearLoginData();
    this.currentUser = null;
    this.set('state', STATE.SIGNED_OUT);

    this.store.unloadAll();

    const currentURL = new URL(window.location.href);
    const redirectUrl = currentURL.pathname;
    if (redirectUrl !== '/' && redirectUrl !== '/sign_in' && redirectUrl !== '/accept_invite') {
      this.router.transitionTo('sign-in');
    }
  }

  checkPasswordComplexity(password) {
    if (password.length < 6) {
      this.flashes.error('The password must include at least 6 characters.');
      return false;
    } else if (!password.match(/\d+/) && !password.match(/[^\w\s]+/)) {
      this.flashes.error('The password must include at least one non-alphabetic character (number or special character).');
      return false;
    } else if (!password.match(/[a-z]+/)) {
      this.flashes.error('The password must include at least one lowercase alphabetic character.');
      return false;
    } else {
      return true;
    }
  }

  togglePasswordVisibility(id) {
    console.log("The id");
    console.log(id);
    let element = document.getElementById(id);
    if (element.getAttribute('type') === 'password') {
      element.setAttribute('autocomplete', 'off');
      element.setAttribute('autocorrect', 'off');
      element.setAttribute('spellcheck', 'off');
      element.setAttribute('autocapitalize', 'off');
      element.setAttribute('type', 'text');
    } else if (element.getAttribute('type') === 'text') {
      element.removeAttribute('autocomplete');
      element.removeAttribute('autocorrect');
      element.removeAttribute('spellcheck');
      element.removeAttribute('autocapitalize');
      element.setAttribute('type', 'password');
    }
  }
}
