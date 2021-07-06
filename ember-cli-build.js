'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const SVGO = require('svgo');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    svg: {
      optimize: false,
      paths: [
        'public/images/stroke-icons',
        'public/images/svg'
      ]
    },
    svgJar: {
      optimizer: {
        svgoModule: SVGO,
        plugins: [
          { prefixIds: true },
          { removeViewBox: false },
          { removeTitle: false },
          { removeDesc: false },
          {
            removeUnknownsAndDefaults: {
              unknownContent: false,
            }
          },
          {
            inlineStyles: {
              onlyMatchedOnce: false,
              removeMatchedSelectors: true
            }
          }
        ]
      }
    },
    postcssOptions: {
      compile: {
        enabled: true,
        extension: 'scss',
        parser: require('postcss-scss'),
        plugins: [
          require('@csstools/postcss-sass')
        ]
      }
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
