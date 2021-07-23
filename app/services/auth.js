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
        this.handleLogin();
        this.set('state', STATE.SIGNED_IN);
        this.router.transitionTo('/');
      }
    }).catch((error) => {
      this.flashes.error(error);
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
      this.flashes.notice('Please check your email and confirm your account. If you need to generate a new confirmation email, please resend your confirmation email.')
      this.router.transitionTo('unconfirmed');
    }).catch((error) => {
      this.flashes.error(error);
    });
  }

  autoSignIn() {
    console.log('Automatically signing in');
    this.set('state', STATE.SIGNING_IN);
    try {
      return this.handleLogin().then(() => {
        this.set('state', STATE.SIGNED_IN);
      });
    } catch (error) {
      this.signOut(false);
    }
  }

  enable2FA(otpAttempt) {
    this.api.post(
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
        this.handleLogin();
        this.set('state', STATE.SIGNED_IN);
        this.router.transitionTo('/');
      }
    }).catch((error) => {
      this.flashes.error(error);
    });
  }

  handleLogin() {
    const { storage } = this;
    const { token } = storage;

    if (!token) throw new Error('No login data');

    return this.reloadUser().then((userRecord) => {
      this.currentUser = userRecord;
      storage.accounts.addObject(userRecord);
      storage.set('user', userRecord);
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

  signOut(runTeardown = true) {
    if (this.signedIn) {
      this.api.delete('/v1/users/logout');
    }

    this.storage.clearLoginData();
    this.set('state', STATE.SIGNED_OUT);

    this.store.unloadAll();

    const { currentRouteName } = this.router;
    if (currentRouteName && currentRouteName !== 'sign-in') {
      try {
        this.router.transitionTo('sign-in');
      } catch (e) {

      }
    }
  }
}
