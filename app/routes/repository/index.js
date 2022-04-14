import TravisRoute from 'travis/routes/basic';

export default class RepositoryIndexRoute extends TravisRoute {
  redirect() {
    this.router.transitionTo('repository.update-token');
  }
}
