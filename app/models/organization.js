import Model, { attr } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import dynamicQuery from '../utils/dynamic-query';
import config from 'travis/config/environment';

export default class OrganizationModel extends Model {
  @service storage;
  @service api;

  @attr('string') name;
  @attr('string') description;
  @attr('string') listener_token;
  @attr('string') permission;

  @tracked users = dynamicQuery(this, function* ({ sort = 'email', page = 1 }) {
    const limit = config.pagination.usersPerPage;
    if (sort === 'name') sort = 'email';
    return yield this.store.paginated(
      'user',
      {
        limit,
        page,
        sort_by: sort,
        custom: {
          org_id: this.id,
        },
      },
      { live: false }
    );
  });

  get isUser() {
    return !this.isOwner;
  }

  get isOwner() {
    return this.permission === 'Owner';
  }

  @tracked repositories = dynamicQuery(
    this,
    function* ({ page = 1, filter = '', sort = 'name' }) {
      const limit = config.pagination.repositoriesPerPage;
      return yield this.store.paginated(
        'repository',
        {
          limit,
          page,
          sort_by: sort,
          filter,
          custom: {
            id: this.id,
          },
        },
        { live: false }
      );
    }
  );

  forget() {
    return this.api.post(`/v1/organizations/${this.id}/forget`);
  }

  removeUser(userId) {
    return this.api.post(`/v1/organizations/${this.id}/user/${userId}/remove`);
  }

  addRepository(name, url, type, username, token) {
    return this.api.post(`/v1/repositories`, {
      data: {
        owner_id: this.id,
        name: name,
        url: url,
        server_type: type,
        username: username,
        token: token,
      },
    });
  }

  inviteUser(email, permission) {
    return this.api.post(`/v1/organizations/${this.id}/invite`, {
      data: {
        user_email: email,
        permission: permission,
      },
    });
  }
}
