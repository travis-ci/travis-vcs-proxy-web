import TravisRoute from 'travis/routes/basic';
import { EVENTS } from 'travis/utils/dynamic-query';

const { PAGE_CHANGED } = EVENTS;

export default class ServerRepositoriesRoute extends TravisRoute {
  queryParams = {
    'page': {
      refreshModel: true
    }
  }

  model(params) {
    this.server = this.modelFor('server');
    this.page = params['page'];

    return this.server;
  }

  afterModel() {
    const { server } = this;
    if (server && !server.error) {
      server.repositories.switchToPage(this.page);
    }
  }

  redirect() {
    const { server } = this;
    if (server && !server.error) {
      server.repositories.on(PAGE_CHANGED, page => {
        const queryParams = { 'page': page };
        this.transitionTo({ queryParams });
      });
    }
  }
}
