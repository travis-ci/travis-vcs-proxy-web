import TravisRoute from 'travis/routes/basic';

export default class OrganizationRoute extends TravisRoute {
  needsAuth = true;

  model(params) {
    return this.store.findRecord('organization', params.id).catch(() => {
      this.router.transitionTo('index');
    });
  }
}
