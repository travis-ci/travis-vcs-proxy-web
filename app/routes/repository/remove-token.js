import TravisRoute from 'travis/routes/basic';

export default class RepositoryRemoveTokenRoute extends TravisRoute {
  afterModel() {
    const repo = this.modelFor('repository');
    if (!repo.canModify) {
      this.router.transitionTo('server.repositories', repo.serverProvider);
    }
  }
}
