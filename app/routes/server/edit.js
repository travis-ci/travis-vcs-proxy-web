import TravisRoute from 'travis/routes/basic';

export default class ServerEditRoute extends TravisRoute {
  afterModel() {
    const server = this.modelFor('server');
    if (server.isUser) {
      this.router.transitionTo('servers');
    }
  }
}
