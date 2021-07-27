import TravisRoute from 'travis/routes/basic';

export default class RepositoryRoute extends TravisRoute {
  needsAuth = true;

  model(params) {
    return this.store.findRecord('repository', params.id).catch((error) => {
      this.router.transitionTo('index');
    });
  }
}
   