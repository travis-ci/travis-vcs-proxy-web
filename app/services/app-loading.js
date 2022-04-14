import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import config from 'travis/config/environment';

const { statusPageStatusUrl } = config;

export const TRAVIS_STATUS = {
  UNKNOWN: 'unknown',
  NONE: 'none',
  MAINTENANCE: 'maintenance',
  DEGRADED: 'degraded',
  MINOR: 'minor',
  MAJOR: 'major'
};

export default class AppLoadingService extends Service {
  @service ajax;

  @tracked indicator = TRAVIS_STATUS.UNKNOWN;
  @tracked description = '';

  @task *fetchTravisStatus() {
    if (statusPageStatusUrl) {
      try {
        const { status = {} } = yield this.ajax.request(statusPageStatusUrl) || {};

        const { indicator, description } = status;
        if (indicator || description) {
          this.setProperties({ indicator, description });
        }
      } catch (e) {
        //this.raven.logException(e);
      }
    }
  }
}
