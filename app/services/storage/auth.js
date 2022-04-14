import { tracked } from '@glimmer/tracking';
import { parseWithDefault } from '../storage';
import Service, { inject as service } from '@ember/service';

const storage = getStorage();

export default class StorageAuthService extends Service {
  get token() {
    return storage.getItem('travis.token') || null;
  }
  set token(token) {
    return storage.setItem('travis.token', token);
  }

  @tracked savedUser = this.user;
  @service store;

  get user() {
    const data = parseWithDefault(storage.getItem('travis.user'), null);
    return data && data.user || data;
  }
  set user(user) {
    return storage.setItem('travis.user', serializeUserRecord(user));
  }

  get accounts() {
    const accountsData = storage.getItem('travis.auth.accounts');
    const accounts = parseWithDefault(accountsData, []).map(account =>
      extractAccountRecord(this.store, account)
    );
    //accounts.addArrayObserver(this, {
    //  willChange: 'persistAccounts',
    //  didChange: 'persistAccounts'
    //});
    return accounts;
  }
  set accounts(accounts) {
    this.persistAccounts(accounts);
    return accounts;
  }

  clearLoginData() {
    storage.removeItem('travis.user');
    storage.removeItem('travis.token');
  }

  clear() {
    this.clearLoginData();
    storage.removeItem('travis.auth.accounts');
    storage.removeItem('travis.auth.activeAccountId');
  }
}

// HELPERS

function getStorage() {
  let localStorage = {};
  let sessionStorage = {};
  if (typeof window !== 'undefined') {
    localStorage = window.localStorage;
    sessionStorage = window.sessionStorage;
  }
  // primary storage for auth is the one in which auth data was updated last
  const sessionStorageUpdatedAt = +sessionStorage.getItem('travis.auth.updatedAt');
  const localStorageUpdatedAt = +localStorage.getItem('travis.auth.updatedAt');
  return sessionStorageUpdatedAt > localStorageUpdatedAt ? sessionStorage : localStorage;
}

function serializeUserRecord(record) {
  return JSON.stringify(record.serialize({ includeId: true }));
}

function extractAccountRecord(store, userData) {
  const record = store.peekRecord('user', userData.id);
  return record || store.push(store.normalize('user', userData));
}

