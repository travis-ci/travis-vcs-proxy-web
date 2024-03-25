import Model, { attr } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import dynamicQuery from '../utils/dynamic-query';
import config from 'travis/config/environment';

export default class UserModel extends Model {
  @service storage;
  @service store;
  @service api;

  @attr('string') login;
  @attr('string') name;
  @attr emails;
  @attr orgPermissions;
  @attr('string') permission;
  @attr('boolean') otpRequiredForLogin;

  @tracked organizations = dynamicQuery(
    this,
    function* ({ sort = 'name', page = 1 }) {
      const limit = config.pagination.organizationsPerPage || 1;
      const res = this.store.paginated(
        'organization',
        {
          limit,
          page,
          sort_by: sort,
        },
        { live: false }
      );
      return yield res;
    }
  );

  @tracked repositories = dynamicQuery(
    this,
    function* ({ sort = 'name', filter = '', page = 1 }) {
      const limit = config.pagination.repositoriesPerPage || 1;
      const res = this.store.paginated(
        'repository',
        {
          limit,
          page,
          sort_by: sort,
          filter,
        },
        { live: false }
      );
      return yield res;
    }
  );

  isOrganizationAdmin(orgId) {
    orgId = parseInt(orgId);
    return (
      this.orgPermissions.find((org) => org.id === orgId).permission === 'owner'
    );
  }

  reload() {
    return this.store.queryRecord('user', {});
  }

  updateEmail(newEmail) {
    return this.api.patch('/v1/user/update_email', {
      data: {
        email: newEmail,
      },
    });
  }

  updatePassword(oldPassword, newPassword, passwordConfirmation) {
    return this.api.patch('/v1/user/update_password', {
      data: {
        current_password: oldPassword,
        password: newPassword,
        password_confirmation: passwordConfirmation,
      },
    });
  }

  getAuthorizedApps() {
    return this.api.get('/v1/oauth/authorized_applications');
  }

  revokeAuthorizedApp(id) {
    return this.api.delete(`/v1/oauth/authorized_applications/${id}`);
  }

  authorizeOauth(clientId, responseType, state, redirectUri) {
    return this.api.post('/v1/oauth/authorize', {
      data: {
        client_id: clientId,
        response_type: responseType,
        redirect_uri: redirectUri,
        scope: 'read',
        state,
      },
    });
  }

  removeUser(password, feedback) {
    return this.api.delete('/v1/users', {
      data: {
        password: password,
        feedback: feedback,
      },
    });
  }

  twoFactorUrl() {
    return this.api.get('/v1/user/two_factor_auth/url');
  }

  twoFactorCodes() {
    return this.api.get('/v1/user/two_factor_auth/codes');
  }
}
