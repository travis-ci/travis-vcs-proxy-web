import TravisRoute from 'travis/routes/basic';

export default class OrganizationIndexRoute extends TravisRoute {
  redirect() {
    this.router.transitionTo('repositories.index');
  }
}
