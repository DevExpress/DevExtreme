require('./karma.common.test.shim');

if (typeof Zone !== 'undefined') {
  throw new Error('zone.js is loaded in the zoneless test environment');
}

const testing = require('@angular/core/testing');
const server = require('@angular/platform-server/testing');

const windowUtils = require('devextreme/core/utils/window');

const windowMock = {};
windowMock.window = windowMock;
windowUtils.setWindow(windowMock);

const { ZonelessTestingModule } = require('./karma.zoneless-testing.module');

testing.TestBed.initTestEnvironment(
  [server.ServerTestingModule, ZonelessTestingModule],
  server.platformServerTesting(),
);

const context = require.context('./tests/dist/server', true, /hydration\.spec\.js$/);
context.keys().map(context);
__karma__.start();
