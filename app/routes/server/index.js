import TravisRoute from 'travis/routes/basic';

export default class ServerIndexRoute extends TravisRoute {
  redirect() {
    this.router.transitionTo('server.repositories');
  }
}
