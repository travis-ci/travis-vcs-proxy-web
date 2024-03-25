'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const SVGO = require('svgo');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Add options here
    svg: {
      optimize: false,
      paths: ['public/images/stroke-icons', 'public/images/svg'],
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
            },
          },
          {
            inlineStyles: {
              onlyMatchedOnce: false,
              removeMatchedSelectors: true,
            },
          },
        ],
      },
    },
    postcssOptions: {
      compile: {
        enabled: true,
        extension: 'scss',
        parser: require('postcss-scss'),
        plugins: [require('@csstools/postcss-sass')],
      },
    },
  });

  return app.toTree();
};
