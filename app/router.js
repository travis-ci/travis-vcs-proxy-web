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
  this.route('setup-new-password', { path: '/setup_new_password' });
  this.route('forgot-password', { path: '/forgot_password' });
  this.route('unconfirmed');
  this.route('confirmed');
  this.route('resend-confirmation', { path: '/resend_confirmation' });
  this.route('account', function () {
    this.route('security');
    this.route('change-password', { path: 'change_password' });
    this.route('change-email', { path: 'change_email' });
    this.route('remove-account', { path: 'remove_account' });
    this.route('remove-account-confirm', { path: 'remove_account_confirm' });
  });
  this.route('servers', function () {
    this.route('add');
  });

  this.route('server', { path: '/servers/:id', resetNamespace: true }, function () {
    this.route('edit');
    this.route('authorization-data-refresh', { path: '/authorization_data_refresh' });
    this.route('remove');
    this.route('repositories');
  });

  this.route('repository', { path: '/repositories/:id', resetNamespace: true }, function () {
    this.route('update-token', { path: '/update_token' });
    this.route('remove-token', { path: '/remove_token' });
  });
});
