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
  @attr('boolean') otpRequiredForLogin;

  @tracked servers = dynamicQuery(this, function* ({ page = 1 }) {
    const limit = config.pagination.serversPerPage;
    return yield this.store.paginated('server', {
      limit,
      page,
      sort_by: 'name',
    }, { live: false });
  });

  reload(options = {}) {
    return this.store.queryRecord('user', {});
  }

  updateEmail(newEmail) {
    return this.api.patch('/v1/user/update_email', {
      data: {
        email: newEmail
      }
    });
  }

  updatePassword(oldPassword, newPassword, passwordConfirmation) {
    return this.api.patch('/v1/user/update_password', {
      data: {
        current_password: oldPassword,
        password: newPassword,
        password_confirmation: passwordConfirmation
      }
    });
  }

  getAuthorizedApps() {
    return this.api.get('/v1/oauth/authorized_applications');
  }

  authorizeOauth(clientId, responseType, state, redirectUri) {
    return this.api.post('/v1/oauth/authorize', {
      data: {
        client_id: clientId,
        response_type: responseType,
        redirect_uri: redirectUri,
        scope: 'read',
        state,
      }
    });
  }

  removeUser(password, feedback) {
    return this.api.delete('/v1/users', {
      data: {
        password: password,
        feedback: feedback
      }
    });
  }

  twoFactorUrl() {
    return this.api.get('/v1/user/two_factor_auth/url');
  }

  twoFactorCodes() {
    return this.api.get('/v1/user/two_factor_auth/codes');
  }
}