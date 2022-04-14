import Service from '@ember/service';
import Ember from 'ember';
import fade from 'ember-animated/transitions/fade';

const isTest = Ember.testing;

export const DURATION_NAMES = {
  QUICK: 'quick',
};

export const DURATIONS = {
  [DURATION_NAMES.QUICK]: 200,
};

export default class AnimationService extends Service {
  off = isTest;

  get durations() {
    const { off } = this;

    const durations = Object.values(DURATION_NAMES).reduce((durationMap, name) => {
      durationMap[name] = off ? 0 : DURATIONS[name];
      return durationMap;
    }, {});

    return durations;
  }

  get transitions() {
    return { fade }
  }
}
