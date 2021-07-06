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
});
