import TravisRoute from 'travis/routes/basic';

export default class OrganizationEditRoute extends TravisRoute {
  afterModel() {
    const org = this.modelFor('organization');
    if (org.isUser) {
      this.router.transitionTo('repositories');
    }
  }
}
