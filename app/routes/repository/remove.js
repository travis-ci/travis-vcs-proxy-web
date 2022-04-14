import TravisRoute from 'travis/routes/basic';

export default class RepositoryRemoveRoute extends TravisRoute {
  afterModel() {
    const repo = this.modelFor('repository');
    if (!repo.canModify) {
      this.router.transitionTo('index');
    }
  }
}
