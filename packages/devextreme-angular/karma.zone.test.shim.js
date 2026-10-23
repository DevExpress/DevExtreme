require('./karma.zone-polyfills.test.shim');

const testing = require('@angular/core/testing');
const browser = require('@angular/platform-browser-dynamic/testing');
const { ZoneTestingModule } = require('./karma.zone-testing.module');

testing.TestBed.initTestEnvironment(
  [browser.BrowserDynamicTestingModule, ZoneTestingModule],
  browser.platformBrowserDynamicTesting(),
);

const context = require.context('./tests/dist/zone-modes', true, /\.spec\.js$/);
context.keys().map(context);
__karma__.start();
