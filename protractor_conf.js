exports.config = {
  directConnect: true,
  chromeOnly: true,
  chromeDriver:'./node_modules/grunt-protractor-runner/node_modules/protractor/selenium/chromedriver',
  capabilities: {
    'browserName': 'chrome'
  },
  framework: 'jasmine2',
  specs: ['e2e/**/*.js'],
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },
  baseUrl: 'http://localhost:8000/'
};