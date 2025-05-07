require('./karma.common.test.shim');

const testing = require('@angular/core/testing');
const server = require('@angular/platform-server/testing');

const windowUtils = require('devextreme/core/utils/window');

const windowMock = {};
windowMock.window = windowMock;
windowUtils.setWindow(windowMock);

testing.TestBed.initTestEnvironment(
  server.ServerTestingModule,
  server.platformServerTesting(),
);

const context = require.context('./tests/dist/server', true, /hydration\.spec\.js$/);
context.keys().map(context);
__karma__.start();
