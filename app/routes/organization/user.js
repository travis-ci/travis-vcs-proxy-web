import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';

export default class OrganizationUserRoute extends TravisRoute {
  model(params) {
    return hash({
      user: this.store.peekRecord('user', params.userId),
      organization: this.modelFor('organization'),
    });
  }
}
