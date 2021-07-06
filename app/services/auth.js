import Service, { inject as service } from '@ember/service';
import { equal, reads } from '@ember/object/computed';

const STATE = {
  SIGNING_IN: 'signing_in',
  SIGNED_IN: 'signed_in',
  SIGNED_OUT: 'signed_out'
};

export default class AuthService extends Service {
  state = STATE.SIGNED_OUT;
  store = service();
  @service('storage') localStorage;
  @service api;
  storage = reads('localStorage.auth');

  signedIn = equal('state', STATE.SIGNED_IN);
  signedOut = equal('state', STATE.SIGNED_OUT);

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
    );
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
    );
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
