import EmberRouter from '@ember/routing/router';
import config from 'travis/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('index', { path: '/' });
  this.route('sign-in', { path: '/sign_in' });
  this.route('sign-up', { path: '/sign_up' });
  this.route('two-factor-authentication', { path: '/two_factor_authentication' });
  this.route('setup-new-password', { path: '/setup_new_password' });
  this.route('forgot-password', { path: '/forgot_password' });
  this.route('first-page-without-confirmation', { path: '/first_page_without_confirmation' });
  this.route('settings', { path: '/settings' });
});
