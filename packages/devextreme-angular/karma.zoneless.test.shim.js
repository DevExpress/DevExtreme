require('./karma.common.test.shim');

if (typeof Zone !== 'undefined') {
  throw new Error('zone.js is loaded in the zoneless test environment');
}

const testing = require('@angular/core/testing');
const browser = require('@angular/platform-browser-dynamic/testing');
const { ZonelessTestingModule } = require('./karma.zoneless-testing.module');

testing.TestBed.initTestEnvironment(
  [browser.BrowserDynamicTestingModule, ZonelessTestingModule],
  browser.platformBrowserDynamicTesting(),
);

const context = require.context('./tests/dist/zone-modes', true, /\.spec\.js$/);
context.keys().map(context);
__karma__.start();
