require("./karma.common.test.shim");

const testing = require("@angular/core/testing");
const browser = require("@angular/platform-browser-dynamic/testing");

testing.TestBed.initTestEnvironment(
    browser.BrowserDynamicTestingModule,
    browser.platformBrowserDynamicTesting()
);

const context = require.context('./tests/dist', true, /^.\/(?!.*\/ssr-components.spec.js$).*\.spec\.js$/);
context.keys().map(context);
__karma__.start();