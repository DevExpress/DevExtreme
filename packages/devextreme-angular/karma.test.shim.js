require('./karma.common.test.shim');
const path = require('path');

const testing = require('@angular/core/testing');
const browser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(
  browser.BrowserDynamicTestingModule,
  browser.platformBrowserDynamicTesting(),
);

console.log('-----path----->', path.resolve('./tests/dist'));
const context = require.context('./tests/dist', true, /^.\/(?!.*\/ssr-components\.spec.js$).*\.spec\.js$/);
context.keys().map(context);
__karma__.start();
