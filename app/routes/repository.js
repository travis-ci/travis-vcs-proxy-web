import TravisRoute from 'travis/routes/basic';

export default class RepositoryRoute extends TravisRoute {
  needsAuth = true;

  model(params) {
    return this.store.findRecord('repository', params.id).catch(() => {
      this.router.transitionTo('index');
    });
  }
}
   