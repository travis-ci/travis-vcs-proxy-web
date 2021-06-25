import Service, { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default class APIService extends Service {
  @service ajax;
  @service auth;

  get(url, options = {}) {
    return this.request(url, 'GET', options);
  }

  post(url, options = {}) {
    return this.request(url, 'POST', options);
  }

  patch(url, options = {}) {
    return this.request(url, 'PATCH', options);
  }

  put(url, options = {}) {
    return this.request(url, 'PUT', options);
  }

  delete(url, options = {}) {
    return this.request(url, 'DELETE', options);
  }

  request(url, method = 'GET', options = {}) {
    options.host = config.apiEndpoint || '';

    options.headers = this.setupHeaders(options);

    return this.ajax.request(url, method, options);
  }

  setupHeaders(options = {}) {
    const { headers = {} } = options;
    const { token } = this.auth;

    // Authorization
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    return headers;
  }
};
