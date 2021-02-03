require("./karma.common.test.shim");

const testing = require("@angular/core/testing");
const server = require("@angular/platform-server/testing");

var windowUtils = require("devextreme/core/utils/window");
windowUtils.hasWindow = function() {
    return false;
};
var windowMock = {};
windowMock.window = windowMock;
windowUtils.getWindow = function() {
    return windowMock;
};

testing.TestBed.initTestEnvironment(
    server.ServerTestingModule,
    server.platformServerTesting()
);

const context = require.context('./tests/dist/server', true, /\.spec\.js$/);
context.keys().map(context);
__karma__.start();
