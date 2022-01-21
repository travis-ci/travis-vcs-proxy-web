import TravisRoute from 'travis/routes/basic';

export default class OrganizationUserRemoveRoute extends TravisRoute {
  afterModel() {
    const org = this.modelFor('organization');
    if (org.isUser) {
      this.router.transitionTo('repositories');
    }
  }
}
