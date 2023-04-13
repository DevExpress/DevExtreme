/* eslint-disable no-undef */
/* eslint-env node */

const createTestCafe = require('testcafe');
const fs = require('fs');
const process = require('process');
const parseArgs = require('minimist');
const dashboardReporter = require('testcafe-reporter-dashboard-devextreme');
const testPageUtils = require('./helpers/clearPage');
require('nconf').argv();

const changeTheme = async(themeName) => createTestCafe.ClientFunction(() => new Promise((resolve) => {
    // eslint-disable-next-line no-undef
    window.DevExpress.ui.themes.ready(resolve);
    // eslint-disable-next-line no-undef
    window.DevExpress.ui.themes.current(themeName);
}),
{ dependencies: { themeName } })();

let testCafe;
let stopwatch = null;

createTestCafe({
    hostname: 'localhost',
    port1: 1437,
    port2: 1438,
})
    .then(tc => {
        testCafe = tc;

        const args = getArgs();
        const testName = args.test.trim();
        const reporter = typeof args.reporter === 'string' ? args.reporter.trim() : args.reporter;
        const indices = args.indices.trim();
        let componentFolder = args.componentFolder.trim();
        const file = args.file.trim();

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

        runner.concurrency(1);

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
            assertionTimeout: 1000,
            nativeAutomation: true,
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

        runOptions.disableScreenshots = true;

        stopwatch = Date.now();

        return runner.run(runOptions);
    })
    .then(failedCount => {
        // eslint-disable-next-line no-console
        console.log('--------execution time-------------');
        // eslint-disable-next-line no-console
        console.log(Date.now() - stopwatch);

        testCafe.close();
        process.exit(failedCount);
    });

function setTestingPlatform(args) {
    process.env.platform = args.platform;
}

function setTestingTheme(args) {
    process.env.theme = args.theme || 'generic.light';
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
            concurrency: 0,
            browsers: 'chrome',
            test: '',
            reporter: ['minimal', dashboardReporter],
            componentFolder: '',
            file: '*',
            cache: true,
            quarantineMode: false,
            indices: '',
            platform: '',
            theme: '',
        }
    });
}
