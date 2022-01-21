import TravisRoute from 'travis/routes/basic';
import { EVENTS } from 'travis/utils/dynamic-query';

const { PAGE_CHANGED } = EVENTS;

export default class OrganizationRepositoriesRoute extends TravisRoute {
  queryParams = {
    'page': {
      refreshModel: true
    }
  }

  model(params) {
    this.organization = this.modelFor('organization');
    this.page = params['page'];

    return this.organization;
  }

  afterModel() {
    const { organization } = this;
    if (organization && !organization.error) {
      organization.repositories.switchToPage(this.page);
    }
  }

  redirect() {
    const { organization } = this;
    if (organization && !organization.error) {
      organization.repositories.on(PAGE_CHANGED, page => {
        const queryParams = { 'page': page };
        this.transitionTo({ queryParams });
      });
    }
  }
}
