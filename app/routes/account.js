import TravisRoute from 'travis/routes/basic';

export default class AccountRoute extends TravisRoute {
  needsAuth = true;
}
