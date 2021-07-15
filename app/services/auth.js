import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

const STATE = {
  SIGNING_IN: 'signing_in',
  SIGNED_IN: 'signed_in',
  SIGNED_OUT: 'signed_out',
  REQUIRES_2FA: 'requires_2fa'
};

export default class AuthService extends Service {
  @tracked state = STATE.SIGNED_OUT;
  store = service();
  @service('storage') localStorage;
  @service api;
  @service flashes;
  @service router;
  storage = this.localStorage.auth;

  get signedIn() {
    return this.state == STATE.SIGNED_IN;
  }
  get signedOut() {
    return this.state == STATE.SIGNED_OUT;
  }
  get requires2FA() {
    return this.state == STATE.REQUIRES_2FA;
  }

  signIn(email, password) {
    this.api.post(
      '/v1/users/login',
      {
        data: {
          user: {
            email,
            password,
          }
        }
      }
    ).then((data) => {
      //if (data.otp_required_for_login && !!token) {
        this.set('state', STATE.REQUIRES_2FA);
      //} else {
        // Set token
      //  this.set('state', STATE.SIGNED_IN);
      //  this.router.transitionTo('/');
      //}
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

    } catch (error) {
      this.signOut(false);
    }
  }

  signOut(runTeardown = true) {
    if (this.signedIn) {
      this.api.delete('/v1/users/logout');
    }

    this.localStorage.clearPreferencesData();

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
