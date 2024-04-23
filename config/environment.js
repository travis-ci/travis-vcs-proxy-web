'use strict';

const {
	VCS_PROXY_API_ENDPOINT,
        VCS_PROXY_BETA,
} = process.env;

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'travis',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    apiEndpoint: 'https://travis-vcs-proxy.travis-ci.org',
    statusPageStatusUrl: 'https://pnpcptp8xh9k.statuspage.io/api/v2/status.json',
    beta: false,

    urls: {
      blog: 'https://blog.travis-ci.com',
      changelog: 'https://changelog.travis-ci.com',
      community: 'https://travis-ci.community',
      docs: 'https://docs.travis-ci.com/user/travis-ci-vcs-proxy-get-started',
      imprint: 'https://docs.travis-ci.com/imprint.html',
      legal: 'https://ideracorp.com/legal/TravisCI',
      jobs: 'https://travisci.workable.com/',
      status: 'https://www.traviscistatus.com/',
      support: 'mailto:support@travis-ci.com',
      travisVsJenkins: 'https://travis-ci.com/travisci-vs-jenkins',
      twitter: 'https://twitter.com/travisci',
      tos: 'https://www.ideracorp.com/legal/TravisCI#tabs-2',
      privacyPolicy: 'https://www.ideracorp.com/legal/TravisCI#tabs-3',
      help: 'https://docs.travis-ci.com/user/travis-ci-vcs-proxy',
      twofactor: 'https://docs.travis-ci.com/user/travis-ci-vcs-proxy',
    },

    pagination: {
      usersPerPage: 20,
      repositoriesPerPage: 20,
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  if (typeof process !== 'undefined') {
    if (VCS_PROXY_API_ENDPOINT) {
      ENV.apiEndpoint = VCS_PROXY_API_ENDPOINT;
    }
    if (VCS_PROXY_BETA) {
      ENV.beta = VCS_PROXY_BETA;
    }
  }

  return ENV;
};
