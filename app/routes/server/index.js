import TravisRoute from 'travis/routes/basic';

export default class AccountIndexRoute extends TravisRoute {
  redirect() {
    this.router.transitionTo('server.edit');
  }
}
