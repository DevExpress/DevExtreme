/* eslint-disable no-undef */
/* eslint-env node */

const createTestCafe = require('testcafe');
const fs = require('fs');
const process = require('process');
const parseArgs = require('minimist');
const dashboardReporter = require('testcafe-reporter-dashboard-devextreme');
const testPageUtils = require('./helpers/clearPage');
require('nconf').argv();

const express = require('express');

const app = express();
const port = 3000;
const reports = [];

app.use(express.json({ type: 'application/csp-report' }));

app.post('/report', (request, response) => {
    const { 'csp-report': report } = request.body;

    if(report != null) {
        const {
            'source-file': sourceFile,
            'original-policy': originalPolicy,
            'violated-directive': violatedDirective,
            'blocked-uri': blockedUri,
            'line-number': lineNumber
        } = report;

        if(blockedUri != null && !blockedUri.includes('testcafe') && !blockedUri.includes('hammerhead')) {
            if(sourceFile == null) {
                reports.push({ originalPolicy, violatedDirective, blockedUri, lineNumber });
            } else if(!sourceFile.includes('testcafe') && !sourceFile.includes('hammerhead')) {
                reports.push({ originalPolicy, violatedDirective, blockedUri, lineNumber, sourceFile });
            }
        }
    }

    response.status(200);
    response.end();
});

const changeTheme = async(themeName) => createTestCafe.ClientFunction(() => new Promise((resolve) => {
    // eslint-disable-next-line no-undef
    window.DevExpress.ui.themes.ready(resolve);
    // eslint-disable-next-line no-undef
    window.DevExpress.ui.themes.current(themeName);
}),
{ dependencies: { themeName } })();

let testCafe;
createTestCafe({
    hostname: 'localhost',
    port1: 1437,
    port2: 1438,
    // eslint-disable-next-line spellcheck/spell-checker
    experimentalProxyless: true,
    configFile: './testing/testcafe/.testcaferc.js'
})
    .then(tc => {
        testCafe = tc;

        const args = getArgs();
        const testName = args.test.trim();
        const reporter = typeof args.reporter === 'string' ? args.reporter.trim() : args.reporter;
        const indices = args.indices.trim();
        let componentFolder = args.componentFolder.trim();
        const file = args.file.trim();
        // eslint-disable-next-line spellcheck/spell-checker
        allowTestcafeCSP();
        setTestingPlatform(args);
        setTestingTheme(args);

        componentFolder = componentFolder ? `${componentFolder}/**` : '**';
        if(fs.existsSync('./testing/testcafe/screenshots')) {
            fs.rmSync('./testing/testcafe/screenshots', { recursive: true });
        }

        const browsers = args.browsers.split(' ').map(expandBrowserAlias);
        // eslint-disable-next-line no-console
        console.log('Browsers:', browsers);

        const runner = testCafe.createRunner()
            .browsers(browsers)
            .reporter(reporter)
            .src([`./testing/testcafe/tests/${componentFolder}/${file}.ts`]);

        runner.compilerOptions({
            'typescript': {
                customCompilerModulePath: '../../node_modules/typescript',
            }
        });

        runner.concurrency(args.concurrency || 3);

        const filters = [];
        if(indices) {
            const [current, total] = indices.split(/_|of|\\|\//ig).map(x => +x);
            let testIndex = 0;
            filters.push(() => {
                const result = (testIndex % total) === (current - 1);
                testIndex += 1;
                return result;

            });
        }
        if(testName) {
            filters.push(name => name === testName);
        }
        if(filters.length) {
            runner.filter((...args) => {
                for(let i = 0; i < filters.length; i++) {
                    if(!filters[i](...args)) {
                        return false;
                    }
                }
                return true;
            });
        }
        if(args.cache) {
            runner.cache = args.cache;
        }

        const runOptions = {
            quarantineMode: { successThreshold: 1, attemptLimit: 3 },
        };

        if(args.componentFolder.trim() !== 'renovation') {
            runOptions.hooks = {
                test: {
                    after: async() => {
                        await testPageUtils.clearTestPage();
                    }
                },
            };

            if(args.theme) {
                runOptions.hooks.test.before = async() => {
                    await changeTheme(args.theme);
                };
            }
        }

        if(args.browsers === 'chrome:docker') {
            runOptions.disableScreenshots = true;
        }

        app.listen(port);

        return runner.run(runOptions);
    })
    .then(failedCount => {
        testCafe.close();

        const messages = reports.filter((obj, index) => {
            return index === reports.findIndex(o => (
                obj.violatedDirective === o.violatedDirective &&
                obj.blockedUri === o.blockedUri &&
                obj.lineNumber === o.lineNumber
            ));
        });

        console.log(messages);

        process.exit(failedCount);
    });

function setTestingPlatform(args) {
    process.env.platform = args.platform;
}

function setTestingTheme(args) {
    process.env.theme = args.theme || 'generic.light';
}

// eslint-disable-next-line spellcheck/spell-checker
function allowTestcafeCSP() {
    const filePath = `${__dirname}/../../node_modules/testcafe/lib/proxyless/request-pipeline/index.js`;
    const file = fs.readFileSync(filePath).toString();
    fs.writeFileSync(filePath, Buffer.from(file.replace(
        'await this._client.Page.setBypassCSP({ enabled: true });',
        'await this._client.Page.setBypassCSP({ enabled: false });'
    )));
    console.log(fs.readFileSync(filePath).toString());
}

function expandBrowserAlias(browser) {
    switch(browser) {
        case 'chrome:devextreme-shr2':
            return 'chrome:headless --disable-gpu --window-size=1200,800';
        case 'chrome:docker':
            return 'chromium:headless --no-sandbox --disable-gpu --window-size=1200,800';
    }

    return browser;
}

function getArgs() {
    return parseArgs(process.argv.slice(1), {
        default: {
            concurrency: 1,
            browsers: 'chrome',
            test: '',
            reporter: ['minimal', dashboardReporter],
            componentFolder: 'editors/list',
            file: 'paging',
            cache: true,
            quarantineMode: false,
            indices: '',
            platform: '',
            theme: '',
        }
    });
}
