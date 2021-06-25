import Service, { inject as service } from '@ember/service';

export default class StorageService extends Service {
  @service('storage/auth') auth;

  parseWithDefault(key, defaultValue) {
    return parseWithDefault(this.getItem(key), defaultValue);
  }

  // method proxies

  getItem(key) {
    return this.storage.getItem(key);
  }

  setItem(key, value) {
    return this.storage.setItem(key, value);
  }

  removeItem(key) {
    return this.storage.removeItem(key);
  }

  clear() {
    return this.storage.clear();
  }

  get storage() {
    return window.localStorage;
  }
};

export function parseWithDefault(json, defaultValue) {
  try {
    return JSON.parse(json) || defaultValue;
  } catch (e) {
    return defaultValue;
  }
}
