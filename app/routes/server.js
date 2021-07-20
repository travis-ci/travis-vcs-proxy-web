
import TravisRoute from 'travis/routes/basic';

export default class ServerRoute extends TravisRoute {
  needsAuth = true;

  model(params) {
    return this.store.findRecord('server', params.id);
  }
}
   