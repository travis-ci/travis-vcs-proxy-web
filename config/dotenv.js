module.exports = function (env) {
  return {
    clientAllowedKeys: [
      'VCS_PROXY_API_ENDPOINT'
    ],
    failOnMissingKey: false,
  };
};
