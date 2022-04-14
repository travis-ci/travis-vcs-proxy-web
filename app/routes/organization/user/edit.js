import TravisRoute from 'travis/routes/basic';

export default class OrganizationUsersEditRoute extends TravisRoute {
  afterModel() {
    this.router.transitionTo('index');
  }
}
