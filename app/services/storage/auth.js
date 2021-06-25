import { computed } from '@ember/object';
import { assert } from '@ember/debug';
import { parseWithDefault } from '../storage';
import {
  reads
} from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';

const storage = getStorage();

export default class StorageAuthService extends Service {
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
  return record.serialize({ includeId: true, forLocalStorage: true });
}

function extractAccountRecord(store, userData) {
  const record = store.peekRecord('user', userData.id);
  return record || store.push(store.normalize('user', userData));
}

