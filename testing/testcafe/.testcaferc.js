const { RequestHook } = require('testcafe');
const { join } = require('path');
const { pathToFileURL } = require('url');

const url = (currentDir, pagePath) => {
    const path = join(currentDir, pagePath);

    return pathToFileURL(path).href;
};

class Hook extends RequestHook {
    constructor(requestFilterRules) {
        super(requestFilterRules);
    }

    onRequest(e) {}

    onResponse(e) {}

    _onConfigureResponse(event) {
        event.setHeader('Content-Security-Policy-Report-Only', 'default-src \'self\'; report-uri http://localhost:3000/report');
    }
}

module.exports = {
    hooks: {
        request: new Hook(url(__dirname, 'tests/container.html')),
    },
}
