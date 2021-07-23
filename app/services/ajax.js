import { Promise as EmberPromise } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import { warn } from '@ember/debug';
import serializeQueryParams from 'ember-fetch/utils/serialize-query-params';
import fetch from 'fetch';

const DEFAULT_ACCEPT = 'application/json';

export default Service.extend({
  storage: service(),

  getDefaultOptions() {
    return {
      accept: DEFAULT_ACCEPT,
    };
  },

  isRetrieve(method) {
    return method === 'GET' || method === 'HEAD';
  },

  setupHeaders(method, options = {}) {
    const { headers = {} } = options;

    // Content-Type
    if (!this.isRetrieve(method)) {
      headers['Content-Type'] = options.contentType || 'application/json; charset=utf-8';
    }

    // Accept
    headers['Accept'] = options.accept || DEFAULT_ACCEPT;

    return headers;
  },

  setupBody(method, options) {
    if (this.isRetrieve(method)) {
      return null;
    }

    const { data, stringifyData } = options;
    if (data && stringifyData !== false && typeof data !== 'string') {
      return JSON.stringify(data);
    }

    return data;
  },

  setupUrl(requestUrl, method, options) {
    const { host = '', data } = options;
    const baseUrl = `${host}${requestUrl}`;

    if (data && this.isRetrieve(method)) {
      const params = serializeQueryParams(data);
      const delimiter = baseUrl.indexOf('?') === -1 ? '?' : '&';
      return `${baseUrl}${delimiter}${params}`;
    }

    return baseUrl;
  },

  request(requestUrl, mthd = 'GET', opts = {}) {
    const defaultOpts = this.getDefaultOptions();
    const options = Object.assign({}, defaultOpts, opts);
    const method = mthd.toUpperCase();

    const url = this.setupUrl(requestUrl, method, options);

    options.body = this.setupBody(method, options);

    options.headers = this.setupHeaders(method, options);

    return this.fetchRequest(url, method, options);
  },

  fetchRequest(url, method, options) {
    return new EmberPromise((resolve, reject) => {
      const { headers, body } = options;
      const fetchOptions = {
        headers,
        method,
      };
      if (body) {
        fetchOptions['body'] = body;
      }

      fetch(url, fetchOptions).then(response => {
        const { 'content-type': resContentType = '' } = response.headers.map;
        const resBodyLength = response._bodyBlob.size;

        let resContent;
        if (resContentType.includes('application/json') && resBodyLength > 0) {
          resContent = response.json();
        } else {
          resContent = response.text();
        }

        resContent
          .then(data => {
            if (!response.ok) {
              this.handleFetchError(reject, data.error || data.errors);
            } else {
              resolve(data);
            }
          })
          .catch(error => this.handleFetchError(reject, error));
      }).catch(error => {
        this.handleFetchError(reject, error.message);
      });
    });
  },

  handleFetchError(reject, error) {
    reject(error);
    this.logFetchError(error);
  },

  logFetchError(response) {
    const message = `[ERROR] Fetch error: ${response}`;
    warn(message, { id: 'travis.ajax.fetch' });
  },
});
