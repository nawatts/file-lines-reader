module.exports = (config) => {
  config.set({
    babelPreprocessor: {
      options: {
        sourceMap: 'inline',
      },
    },
    browsers: ['PhantomJS'],
    colors: true,
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'node_modules/phantomjs-polyfill/bind-polyfill.js',
      'lib/file-lines-reader.js',
      'tests/*.spec.js',
    ],
    frameworks: [
      'mocha',
      'chai-as-promised',
      'chai',
    ],
    logLevel: config.LOG_INFO,
    plugins: [
      'karma-babel-preprocessor',
      'karma-chai',
      'karma-chai-as-promised',
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-phantomjs-launcher',
      'karma-spec-reporter',
      'karma-sourcemap-loader',
    ],
    preprocessors: {
      'tests/*.spec.js': ['babel', 'sourcemap'],
    },
    reporters: ['spec'],
    singleRun: true,
  });
};
