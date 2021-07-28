import TravisRoute from 'travis/routes/basic';
import { action } from '@ember/object';
import { EVENTS } from 'travis/utils/dynamic-query';

const { PAGE_CHANGED } = EVENTS;

export default class ServersRoute extends TravisRoute {
  needsAuth = true;
  page = 1;
  queryParams = {
    'page': {
      refreshModel: true
    }
  }

  model(params) {
    this.page = params['page'];
  }

  afterModel() {
    const { currentUser } = this.auth;
    if (currentUser && !currentUser.error) {
      currentUser.servers.switchToPage(this.page);
    }
  }

  redirect() {
    const { currentUser } = this.auth;
    if (currentUser && !currentUser.error) {
      currentUser.servers.on(PAGE_CHANGED, page => {
        const queryParams = { 'page': page };
        this.transitionTo({ queryParams });
      });
    }
  }
}
