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

    onRequest(event) {}

    onResponse(event) {}

    _onConfigureResponse(event) {
        const policies = [
            'default-src \'self\'',
            'script-src \'self\'',
            'style-src \'self\' https://fonts.gstatic.com',
            'font-src \'self\' https://fonts.gstatic.com data:',
            'img-src \'self\' data:',
            'report-uri http://localhost:3000/report'
        ]

        event.setHeader('Content-Security-Policy-Report-Only', policies.join('; '));
    }
}

module.exports = {
    hooks: {
        request: new Hook(url(__dirname, 'tests/container.html')),
        // request: new Hook(url(__dirname, '../../artifacts/js/dx.all.js')),
    },
}
